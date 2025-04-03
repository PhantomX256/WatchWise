import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  CircularProgress,
  Alert,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  IconButton,
} from "@mui/material";
import {
  Bookmark as BookmarkIcon,
  People as PeopleIcon,
  Add as AddIcon,
  Movie as MovieIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useWatchListService } from "../lib/hooks/watchlistHooks";

const Watchlist = () => {
  const { isLoading, error, handleGetWatchlists, handleCreateWatchlist } =
    useWatchListService();
  const [watchlists, setWatchlists] = useState([]);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [newWatchlistTitle, setNewWatchlistTitle] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState(null);
  const [memberIds, setMemberIds] = useState([]);
  const [newMemberId, setNewMemberId] = useState("");
  const [memberError, setMemberError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadWatchlists = async () => {
      try {
        const data = await handleGetWatchlists();
        setWatchlists(data);
      } catch (err) {
        // Error is handled by the hook
        console.error("Failed to load watchlists", err);
      }
    };

    loadWatchlists();
  }, []);

  const handleOpenWatchlist = (id) => {
    navigate(`/watchlist/${id}`);
  };

  const handleCreateNewWatchlist = async () => {
    if (!newWatchlistTitle.trim()) {
      setCreateError("Please enter a watchlist title");
      return;
    }

    setCreateLoading(true);
    setCreateError(null);

    try {
      const newWatchlist = await handleCreateWatchlist({
        title: newWatchlistTitle,
        members: memberIds, // Include memberIds in the watchlist creation
      });

      // Add the new watchlist to state
      setWatchlists((prevWatchlists) => [...prevWatchlists, newWatchlist]);

      // Close dialog and reset form
      setOpenCreateDialog(false);
      setNewWatchlistTitle("");
      setMemberIds([]);
      setNewMemberId("");

      // Navigate to the new watchlist
      navigate(`/watchlist/${newWatchlist.id}`);
    } catch (err) {
      setCreateError(err.message || "Failed to create watchlist");
    } finally {
      setCreateLoading(false);
    }
  };

  // Add function to handle adding members
  const handleAddMember = () => {
    if (!newMemberId.trim()) {
      setMemberError("Please enter a valid user ID");
      return;
    }

    // Check if member ID is already in the list
    if (memberIds.includes(newMemberId.trim())) {
      setMemberError("This user is already added");
      return;
    }

    setMemberIds([...memberIds, newMemberId.trim()]);
    setNewMemberId("");
    setMemberError(null);
  };

  // Add function to handle removing members
  const handleRemoveMember = (idToRemove) => {
    setMemberIds(memberIds.filter((id) => id !== idToRemove));
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "rgb(15, 18, 20)",
        paddingTop: 10,
      }}
    >
      <Container maxWidth="md" sx={{ py: 5 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{ fontWeight: 700, color: "white" }}
          >
            My Watchlists
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenCreateDialog(true)}
            sx={{
              bgcolor: "rgba(58, 105, 172, 0.8)",
              "&:hover": { bgcolor: "rgba(58, 105, 172, 1)" },
            }}
          >
            Create New
          </Button>
        </Box>

        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ my: 2 }}>
            {error}
          </Alert>
        ) : watchlists.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 8,
              bgcolor: "rgba(28, 34, 38, 0.6)",
              borderRadius: 2,
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <BookmarkIcon
              sx={{ fontSize: 60, color: "rgba(58, 105, 172, 0.7)", mb: 2 }}
            />
            <Typography variant="h6" sx={{ color: "white", mb: 2 }}>
              You don't have any watchlists yet
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenCreateDialog(true)}
              sx={{
                bgcolor: "rgba(58, 105, 172, 0.8)",
                "&:hover": { bgcolor: "rgba(58, 105, 172, 1)" },
              }}
            >
              Create Your First Watchlist
            </Button>
          </Box>
        ) : (
          <List
            sx={{
              bgcolor: "rgba(28, 34, 38, 0.6)",
              borderRadius: 2,
              border: "1px solid rgba(255, 255, 255, 0.1)",
              overflow: "hidden",
            }}
          >
            {watchlists.map((watchlist, index) => (
              <React.Fragment key={watchlist.id}>
                <ListItem
                  alignItems="flex-start"
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="view"
                      onClick={() => handleOpenWatchlist(watchlist.id)}
                    >
                      <ArrowForwardIcon
                        sx={{ color: "rgba(58, 105, 172, 0.8)" }}
                      />
                    </IconButton>
                  }
                  sx={{
                    py: 2,
                    cursor: "pointer",
                    "&:hover": {
                      bgcolor: "rgba(255, 255, 255, 0.05)",
                    },
                  }}
                  onClick={() => handleOpenWatchlist(watchlist.id)}
                >
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        bgcolor: "rgba(58, 105, 172, 0.8)",
                        width: 50,
                        height: 50,
                      }}
                    >
                      <BookmarkIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography
                        variant="h6"
                        sx={{ color: "white", fontWeight: 500 }}
                      >
                        {watchlist.title}
                      </Typography>
                    }
                    secondary={
                      <Box sx={{ display: "flex", mt: 1 }}>
                        <Chip
                          icon={<PeopleIcon />}
                          label={`${watchlist.members?.length || 1} ${
                            watchlist.members?.length === 1
                              ? "Member"
                              : "Members"
                          }`}
                          size="small"
                          sx={{
                            mr: 1,
                            bgcolor: "rgba(58, 105, 172, 0.3)",
                            color: "rgb(182, 190, 201)",
                          }}
                        />
                        <Chip
                          icon={<MovieIcon />}
                          label={`${watchlist.movies?.length || 0} ${
                            watchlist.movies?.length === 1 ? "Movie" : "Movies"
                          }`}
                          size="small"
                          sx={{
                            bgcolor: "rgba(58, 105, 172, 0.3)",
                            color: "rgb(182, 190, 201)",
                          }}
                        />
                      </Box>
                    }
                    sx={{ ml: 1 }}
                  />
                </ListItem>
                {index < watchlists.length - 1 && (
                  <Divider
                    variant="inset"
                    component="li"
                    sx={{ bgcolor: "rgba(255, 255, 255, 0.1)" }}
                  />
                )}
              </React.Fragment>
            ))}
          </List>
        )}
      </Container>

      {/* Create Watchlist Dialog */}
      <Dialog
        open={openCreateDialog}
        onClose={() => {
          setOpenCreateDialog(false);
          setMemberIds([]);
          setNewMemberId("");
          setMemberError(null);
          setCreateError(null);
        }}
        PaperProps={{
          sx: {
            bgcolor: "rgb(28, 34, 38)",
            color: "white",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          },
        }}
      >
        <DialogTitle>Create New Watchlist</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "rgb(182, 190, 201)", mb: 2 }}>
            Give your watchlist a name and add members to share it with others.
          </DialogContentText>

          {/* Watchlist Title Field */}
          <TextField
            autoFocus
            margin="dense"
            label="Watchlist Title"
            fullWidth
            variant="outlined"
            value={newWatchlistTitle}
            onChange={(e) => setNewWatchlistTitle(e.target.value)}
            error={!!createError}
            helperText={createError}
            InputLabelProps={{
              sx: { color: "rgb(182, 190, 201)" },
            }}
            InputProps={{
              sx: {
                color: "white",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255, 255, 255, 0.2)",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255, 255, 255, 0.3)",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(58, 105, 172, 0.8)",
                },
              },
            }}
            sx={{ mb: 3 }}
          />

          {/* Member Management Section */}
          <Typography variant="subtitle1" sx={{ color: "white", mt: 2, mb: 1 }}>
            Add Members (Optional)
          </Typography>

          <Box sx={{ display: "flex", mb: 1 }}>
            <TextField
              size="small"
              label="User ID"
              value={newMemberId}
              onChange={(e) => setNewMemberId(e.target.value)}
              error={!!memberError}
              helperText={memberError}
              variant="outlined"
              InputLabelProps={{
                sx: { color: "rgb(182, 190, 201)" },
              }}
              InputProps={{
                sx: {
                  color: "white",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.2)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.3)",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(58, 105, 172, 0.8)",
                  },
                },
              }}
              sx={{ flexGrow: 1, mr: 1 }}
            />
            <Button
              onClick={handleAddMember}
              variant="outlined"
              sx={{
                color: "rgb(58, 105, 172)",
                borderColor: "rgba(58, 105, 172, 0.5)",
                "&:hover": {
                  backgroundColor: "rgba(58, 105, 172, 0.08)",
                  borderColor: "rgba(58, 105, 172, 0.8)",
                },
              }}
            >
              Add
            </Button>
          </Box>

          {/* Members list */}
          {memberIds.length > 0 && (
            <Box sx={{ mt: 2, mb: 1 }}>
              <Typography
                variant="body2"
                sx={{ color: "rgb(182, 190, 201)", mb: 1 }}
              >
                Members:
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {memberIds.map((id) => (
                  <Chip
                    key={id}
                    label={id}
                    onDelete={() => handleRemoveMember(id)}
                    sx={{
                      bgcolor: "rgba(58, 105, 172, 0.3)",
                      color: "white",
                      "& .MuiChip-deleteIcon": {
                        color: "rgba(255, 255, 255, 0.7)",
                        "&:hover": {
                          color: "rgba(255, 255, 255, 1)",
                        },
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}

          <DialogContentText
            sx={{ color: "rgb(182, 190, 201)", mt: 2, fontSize: "0.85rem" }}
          >
            Note: You'll be able to add more members after creating the
            watchlist.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => {
              setOpenCreateDialog(false);
              setMemberIds([]);
              setNewMemberId("");
              setMemberError(null);
              setCreateError(null);
            }}
            sx={{ color: "rgb(182, 190, 201)" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateNewWatchlist}
            variant="contained"
            disabled={createLoading}
            startIcon={
              createLoading ? <CircularProgress size={20} /> : <AddIcon />
            }
            sx={{
              bgcolor: "rgba(58, 105, 172, 0.8)",
              "&:hover": { bgcolor: "rgba(58, 105, 172, 1)" },
            }}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Watchlist;
