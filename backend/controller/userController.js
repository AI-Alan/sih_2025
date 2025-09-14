exports.peerChat = (req, res) => {
    res.send("peer to peer chat");
}

exports.counsellorChat = (req, res) => {
    res.send("chat with counsellor")
}

exports.aiChat = (req, res) => {
    res.send("chat with AI")
}