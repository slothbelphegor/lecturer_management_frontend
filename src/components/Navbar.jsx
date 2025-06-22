import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import {Link, useLocation}  from 'react-router-dom'
import AxiosInstance from './AxiosInstance';
import { useNavigate } from 'react-router-dom';
import Menu from './Menu';
const drawerWidth = 240;

export default function Navbar(props) {
  const {content} = props
  const location = useLocation();  // define which route is used
  const path = location.pathname 
  const navigate = useNavigate();

  const logoutUser = () => {
    AxiosInstance.post('logout/', {})
     .then(() => {
        localStorage.removeItem('Role');
        localStorage.removeItem('Token');
        navigate('/login');
      })
     .catch((error) => {
        console.log(error);
      });
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Lecturer Management System
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        {/* <Box sx={{ overflow: 'auto' }}>
          <List>
            
              <ListItem key={1} disablePadding>
                <ListItemButton component={Link} to="/" 
                    selected={"/" === path}>
                  <ListItemIcon>
                    <HomeIcon />
                  </ListItemIcon>
                  <ListItemText primary={"Home"} />
                </ListItemButton>
              </ListItem>
              <ListItem key={2} disablePadding>
              <ListItemButton component={Link} to="/about" 
                    selected={"/about" === path}>
                  <ListItemIcon>
                    <InboxIcon />
                  </ListItemIcon>
                  <ListItemText primary={"About"} />
                </ListItemButton>
              </ListItem>
              <ListItem key={3} disablePadding>
              <ListItemButton onClick={logoutUser}>
                  <ListItemIcon>
                    <LogoutIcon />
                  </ListItemIcon>
                  <ListItemText primary={"Logout"} />
                </ListItemButton>
              </ListItem>
              

          </List>
          
        </Box> */}
        <Menu/>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
            {content}
      </Box>
    </Box>
  );
}