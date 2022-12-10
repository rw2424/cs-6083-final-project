import {
  AppBar,
  Avatar,
  Box,
  Button,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import LunchDiningIcon from '@mui/icons-material/LunchDining';
import { deepPurple } from '@mui/material/colors';
import { Logout, Settings } from '@mui/icons-material';
import { useCookies } from 'react-cookie';
import Nextlink from 'next/link';
import { useState, useEffect } from 'react';

export default function Header() {
  const [cookies, setCookie, removeCookie] = useCookies(['user']);
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  useEffect(() => {
    setUser(cookies.user);
  }, [cookies]);

  return (
    <AppBar position="relative">
      <Toolbar>
        <LunchDiningIcon sx={{ mr: 2 }} />
        <Typography variant="h6" noWrap>
          Cookzilla
        </Typography>
        <Box sx={{ flexGrow: 1 }}></Box>
        {user ? (
          <>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <Tooltip title="Account settings">
                <IconButton
                  size="large"
                  sx={{ ml: 2 }}
                  aria-controls={isMenuOpen ? 'account-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={isMenuOpen ? 'true' : undefined}
                  color="primary"
                  onClick={(e) => {
                    setAnchorEl(e.currentTarget);
                  }}
                >
                  <Avatar
                    sx={{ width: 32, height: 32, bgcolor: deepPurple[500] }}
                  >
                    {user.userName[0]}
                  </Avatar>
                </IconButton>
              </Tooltip>
            </Box>
            <Menu
              anchorEl={anchorEl}
              open={isMenuOpen}
              onClose={() => {
                setAnchorEl(null);
              }}
            >
              <MenuItem>
                <ListItemIcon>
                  <Settings fontSize="small" />
                </ListItemIcon>
                Settings
              </MenuItem>
              <MenuItem
                onClick={async (e) => {
                  e.preventDefault();
                  removeCookie('user');
                }}
              >
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Nextlink href="/login">
            <Button color="success" variant="contained">
              Login
            </Button>
          </Nextlink>
        )}
      </Toolbar>
    </AppBar>
  );
}
