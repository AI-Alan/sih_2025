from __future__ import annotations

import hashlib
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

import chromadb
from chromadb.config import Settings as ChromaSettings

try:
    from sentence_transformers import SentenceTransformer
except Exception as e:  # pragma: no cover
    SentenceTransformer = None  # type: ignore

from ..config.settings import settings


@dataclass
class RetrievedItem:
    text: str
    metadata: Dict[str, Any]
    distance: float


class LocalEmbedder:
    def __init__(self, model_name: str):
        if SentenceTransformer is None:
            raise RuntimeError("sentence-transformers not available")
        try:
            self.model = SentenceTransformer(model_name)
        except Exception as e:
            # Bubble up to fallback to NoopVectorMemory
            raise RuntimeError(f"failed to load embeddings model: {e}")

    def encode(self, texts: List[str]) -> List[List[float]]:
        try:
            result = self.model.encode(texts, convert_to_numpy=False, normalize_embeddings=True)
            # Handle both numpy arrays and lists
            if hasattr(result, 'tolist'):
                return result.tolist()
            else:
                return result  # Already a list
        except Exception as e:
            logger.warning(f"Embedding encoding failed: {e}")
            # Return zero vectors as fallback
            return [[0.0] * 384 for _ in texts]  # 384 is common embedding dim


class VectorMemory:
    def __init__(self):
        self.persist_dir: Path = settings.chroma_dir
        self.persist_dir.mkdir(parents=True, exist_ok=True)
        self.client = chromadb.PersistentClient(
            path=str(self.persist_dir),
            settings=ChromaSettings(anonymized_telemetry=False),
        )
        self.collection_name = "student_memories"
        self.collection = self.client.get_or_create_collection(name=self.collection_name)

        # Embedding - this can fail if sentence-transformers is not available or model download fails
        try:
            self.embedder = LocalEmbedder(settings.embedding_model)
            logger.info(f"Vector memory initialized with embedding model: {settings.embedding_model}")
        except Exception as e:
            logger.warning(f"Failed to initialize embeddings: {e}")
            raise  # Re-raise to trigger fallback to NoopVectorMemory

    @staticmethod
    def _make_id(student_id: str, role: str, text: str) -> str:
        h = hashlib.sha256(f"{student_id}:{role}:{text}".encode("utf-8")).hexdigest()[:32]
        return f"{student_id}-{role}-{h}"

    def upsert(self, student_id: str, role: str, text: str, domain: Optional[str]) -> None:
        if not text.strip():
            return
        try:
            emb = self.embedder.encode([text])[0]
        except Exception as e:
            logger.warning(f"Failed to encode text for vector memory: {e}")
            return  # Skip upsert if encoding fails
        _id = self._make_id(student_id, role, text)
        metadata = {"student_id": student_id, "role": role}
        if domain:
            metadata["domain"] = domain
        self.collection.upsert(
            ids=[_id],
            embeddings=[emb],
            documents=[text],
            metadatas=[metadata],
        )

    def query(self, student_id: str, domain: Optional[str], text: str, top_k: int = 5) -> List[RetrievedItem]:
        if not text.strip():
            return []
        emb = self.embedder.encode([text])[0]
        where: Dict[str, Any] = {"student_id": student_id}
        if domain:
            where["domain"] = domain
        result = self.collection.query(
            query_embeddings=[emb],
            n_results=top_k,
            where=where,
            include=["documents", "metadatas", "distances"],
        )
        docs = result.get("documents", [[]])[0]
        metas = result.get("metadatas", [[]])[0]
        dists = result.get("distances", [[]])[0]
        items: List[RetrievedItem] = []
        for doc, meta, dist in zip(docs, metas, dists):
            if doc is None:
                continue
            items.append(RetrievedItem(text=doc, metadata=meta or {}, distance=float(dist)))
        return items

class NoopVectorMemory:
    """Fallback vector memory that stores nothing, returns nothing.
    Keeps API stable when embeddings are unavailable so service still works.
    """

    def upsert(self, student_id: str, role: str, text: str, domain: Optional[str]) -> None:  # pragma: no cover
        return

    def query(self, student_id: str, domain: Optional[str], text: str, top_k: int = 5) -> List[RetrievedItem]:  # pragma: no cover
        return []


# Initialize with resilience - temporarily force no-op to avoid crashes
print("Temporarily using no-op vector memory to avoid embedding crashes")
vector_memory = NoopVectorMemory()

# Uncomment below when embeddings are working:
# try:
#     # Check if embeddings should be disabled
#     if settings.embedding_model.lower() in ['disabled', 'none', '']:
#         raise RuntimeError("Embeddings disabled via config")
#     vector_memory = VectorMemory()
#     logger.info("Vector memory initialized successfully")
# except Exception as e:
#     logger.warning(f"Vector memory initialization failed, using no-op fallback: {e}")
#     vector_memory = NoopVectorMemory()
