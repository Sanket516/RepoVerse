import User from '../models/user.model.js';

// Utility function to handle GitHub API requests
const handleGitHubFetch = async (url) => {
    const response = await fetch(url, {
        headers: {
            Authorization: `token ${process.env.GITHUB_API_KEY}`,
        },
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`GitHub API error: ${response.statusText}. ${text}`);
    }

    return response.json();
};

export const getUserProfileAndRepos = async (req, res) => {
    const { username } = req.params;

    try {
        const userProfile = await handleGitHubFetch(`https://api.github.com/users/${username}`);
        const repos = await handleGitHubFetch(userProfile.repos_url);

        res.status(200).json({ userProfile, repos });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const likeProfile = async (req, res) => {
    const { username } = req.params;

    try {
        const user = await User.findById(req.user._id.toString());
        const userToLike = await User.findOne({ username });

        if (!userToLike) {
            return res.status(404).json({ error: 'User is not a member' });
        }

        if (user.likedProfiles.includes(userToLike.username)) {
            return res.status(400).json({ error: 'User already liked' });
        }

        userToLike.likedBy.push({
            username: user.username,
            avatarUrl: user.avatarUrl,
            likedDate: Date.now(),
        });
        user.likedProfiles.push(userToLike.username);

        await Promise.all([userToLike.save(), user.save()]);

        res.status(200).json({ message: 'User liked' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getLikes = async (req, res) => {
    try {
        const user = await User.findById(req.user._id.toString());
        res.status(200).json({ likedBy: user.likedBy });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
