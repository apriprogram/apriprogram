function requireLogin(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  } else {
    return res.redirect('/login');
  }
}

function requireAdmin(req, res, next) {
  if (req.session && req.session.userId && (req.session.role === 'admin' || req.session.role === 'super admin')) {
    return next();
  } else {
    if (req.path.startsWith('/api') || (req.headers.accept && req.headers.accept.includes('application/json'))) {
      return res.status(403).json({ success: false, message: "Akses ditolak. Anda bukan admin." });
    } else {
      return res.status(403).send(`
        <!DOCTYPE html>
        <html lang="id">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Akses Ditolak - Apriprogram</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
          <style>
            body { font-family: 'Poppins', sans-serif; }
          </style>
        </head>
        <body class="bg-[#0D0E12] text-slate-300 flex items-center justify-center min-h-screen p-4 selection:bg-red-500 selection:text-white">
          <div class="bg-[#1C1E26] max-w-md w-full rounded-2xl shadow-2xl border border-[#2A2B36] p-8 text-center transition-all duration-300">
            <div class="w-16 h-16 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-red-500/20 shadow-lg shadow-red-500/5">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            </div>
            <h1 class="text-2xl font-bold text-white mb-2 tracking-wide">Akses Ditolak</h1>
            <p class="text-slate-400 text-sm leading-relaxed mb-8">Maaf, Anda tidak memiliki izin administrator untuk mengakses halaman panel ini.</p>
            <button onclick="window.history.back()" class="w-full px-5 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-red-600/20 active:scale-[0.98]">
              Kembali ke Halaman Sebelumnya
            </button>
            <a href="/login" class="block mt-5 text-sm font-medium text-slate-500 hover:text-slate-300 transition-colors">
              Ke Halaman Login
            </a>
          </div>
        </body>
        </html>
      `);
    }
  }
}

module.exports = {
  requireLogin,
  requireAdmin
};
