// src/api/flags.js
// Simple mock flag API for the CTF tab.
//
// IMPORTANT: Do not store real flags in this file.
// Replace this with a backend call in production.

const DUMMY_FLAGS = {
    // Demo only - safe to keep as an example.
    "flag-001": "FLAG{demo-flag}",
};

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// submitFlag - pretend to send a flag to the server and get a response.
export async function submitFlag(challengeId, flagText) {
    await sleep(500); // small delay to feel like a network call

    const cleaned = flagText.trim();
    const expected = DUMMY_FLAGS[challengeId];

    if (!cleaned) {
        return {
            status: "empty",
            message: "Please enter a flag before submitting.",
        };
    }

    if (!expected) {
        return {
            status: "unknown",
            message:
                "No demo flag is configured for this challenge. In the real range this would talk to the scoreboard backend.",
        };
    }

    if (cleaned === expected) {
        return {
            status: "correct",
            message:
                "Correct demo flag. In the real system this would award points and update the leaderboard.",
        };
    }

    return {
        status: "incorrect",
        message: "That flag was not accepted. Double-check your steps and try again.",
    };
}
