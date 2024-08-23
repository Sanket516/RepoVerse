export function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    const clientBaseUrl = process.env.CLIENT_BASE_URL;
    res.redirect(`${clientBaseUrl}/login`);
}
