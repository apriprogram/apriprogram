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
        <body class="bg-[#0D0E12] text-slate-300 min-h-[100dvh] flex flex-col selection:bg-red-500 selection:text-white relative font-['Poppins']">
          
          <!-- Back Button Top Left -->
          <div class="absolute top-6 left-6 z-20">
            <button onclick="window.history.back()" class="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-white hover:bg-white/10 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"></path></svg>
            </button>
          </div>

          <!-- Top Text -->
          <div class="mt-20 sm:mt-32 text-center px-6 z-10">
            <h1 class="text-xl sm:text-3xl font-bold text-white tracking-wide">Akses Ditolak</h1>
          </div>

          <!-- Middle Icon -->
          <div class="flex-1 flex items-center justify-center p-6 z-10">
            <div class="relative flex items-center justify-center w-28 h-28 sm:w-48 sm:h-48">
              <!-- Glow effect -->
              <div class="absolute inset-0 bg-red-500/20 blur-[30px] sm:blur-[40px] rounded-full"></div>
              <!-- Icon Container -->
              <div class="relative z-10 w-24 h-24 sm:w-40 sm:h-40 bg-gradient-to-b from-red-500/20 to-red-500/5 border border-red-500/20 text-red-500 rounded-[1.5rem] sm:rounded-[2.5rem] flex items-center justify-center shadow-lg shadow-red-500/10">
                <svg class="w-12 h-12 sm:w-20 sm:h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
              </div>
            </div>
          </div>

          <!-- Bottom Content -->
          <div class="px-6 pb-8 sm:pb-10 text-center w-full max-w-md mx-auto z-10">
            <p class="text-[11px] sm:text-sm text-slate-400 leading-relaxed mb-6 sm:mb-8 px-2 sm:px-4">
              Maaf, Anda tidak memiliki izin administrator untuk mengakses halaman panel ini.
            </p>
            <button onclick="window.history.back()" class="w-full py-2 sm:py-3 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold text-[11px] sm:text-sm transition-all duration-200 shadow-lg shadow-red-600/20 active:scale-[0.98]">
              Kembali ke Halaman Sebelumnya
            </button>
            <a href="/login" class="block mt-5 sm:mt-6 text-[10px] sm:text-sm font-medium text-slate-500 hover:text-slate-300 transition-colors pb-4">
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
