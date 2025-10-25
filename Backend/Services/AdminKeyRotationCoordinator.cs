namespace LibraryAPI.Services
{
    public class AdminKeyRotationCoordinator
    {
        private CancellationTokenSource _cts = new();

        public CancellationToken Token => _cts.Token;

        public void Reset()
        {
            var old = Interlocked.Exchange(ref _cts, new CancellationTokenSource());
            try { old.Cancel(); } finally { old.Dispose(); }
        }
    }
}
