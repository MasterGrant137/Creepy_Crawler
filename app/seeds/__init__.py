"""Seeds init file."""

from flask.cli import AppGroup
from .users import seed_users, undo_users
from .history import seed_history, undo_history

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')

@seed_commands.command('all')
def seed():
    """Create the `flask seed all` command."""
    seed_users()
    seed_history()

@seed_commands.command('undo')
def undo():
    """Create the `flask seed undo` command."""
    undo_users()
    undo_history()
    # Add other undo functions here
