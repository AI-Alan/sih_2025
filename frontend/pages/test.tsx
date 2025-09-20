import { getRoot } from "../services/test_service";



export default function Test() {
    const handleClick = async () => {
        try {
            const data = await getRoot();
            console.log(data);
            alert(`Response: ${data.message}`);
        } catch (error) {
            console.error("Error fetching data:", error);
            alert("Failed to fetch data");
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Test Page</h1>
            <button onClick={handleClick} style={{ padding: '10px 20px', fontSize: '16px' }}>
                Fetch Data from Backend
            </button>
        </div>
    );
}

