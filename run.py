"""Top-level Flask entry-point to simplify local development.

This module proxies the real application factory that lives in
`Backend.run`.  It lets you run the backend locally with a single
command:

    $ export FLASK_APP=run  # or FLASK_APP=run:create_app
    $ flask run --reload

The existing Vercel deployment continues to use `api/index.py`, which
still imports `Backend.run` directly, so nothing changes for
production.
"""

from importlib import import_module
from typing import Any
import os

# Import the actual factory from the package
_backend_run = import_module("Backend.run")
create_app = getattr(_backend_run, "create_app")  # type: ignore[attr-defined]

# Immediately create an app instance for the simple "FLASK_APP=run" case
app: Any = create_app()

if __name__ == "__main__":
    # Start a debug server only when executed directly.
    # 'flask run' is still the recommended approach.
    app.run(debug=True, host="0.0.0.0", port=int(os.getenv("PORT", 5000))) 