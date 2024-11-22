//side bar tsx
import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layout, Menu, Button, Drawer } from 'antd';
import { MenuDataItem } from '../types';
import {
  DesktopOutlined,
  LogoutOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  SolutionOutlined,
  TagsOutlined,
  UserOutlined,
  MenuOutlined,
  SettingOutlined,
  DatabaseOutlined,
  ProductFilled,
} from '@ant-design/icons';
import { AuthContext } from '../context/AuthContext';

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onCollapse }) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const { logout } = useContext(AuthContext);
  const location = useLocation();
  const [selectedKeys, setSelectedKeys] = useState<string[]>(['1']);
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [visible, setVisible] = useState(false);

  const showDrawer = () => {
    setVisible(true);
    document.body.classList.add('no-scroll');
  };

  const onClose = () => {
    setVisible(false);
    document.body.classList.remove('no-scroll');
  };
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
    } catch (e) {}
    setIsLoggingOut(false);

  }
  useEffect(() => {
    const pathname = location.pathname;
    let selectedKey = '1';

    if (pathname === '/') {
      selectedKey = '1';
    } else {
      const menuItem = menuItems.find((item) => item.path !== '/' && pathname.startsWith(item.path));
      if (menuItem) {
        selectedKey = menuItem.key;
        setOpenKeys(menuItem.subItems ? [menuItem.key] : []);
      }
    }
    setSelectedKeys([selectedKey]);
  }, [location.pathname]);

  const handleMenuClick = (key: string) => {
    setOpenKeys((prevKeys) => (prevKeys.includes(key) ? [] : [key]));
  };

  const menuItems: MenuDataItem[] = [
    {
      key: '1',
      title: 'Dashboard',
      icon: <DesktopOutlined />,
      path: '/',
    },
    {
      key: '2.1',
      title: 'Inventory',
      icon: <ProductFilled />,
      path: '/products'
    },
    {
      key: '3',
      title: 'Orders',
      icon: <ShoppingCartOutlined />,
      path: '/orders/all',
    },
    {
      key: '1.2',
      title: 'Maali Bookings',
      icon: <ShopOutlined />,
      path: '/maali-bookings/all',
    },
    {
      key: '7',
      title: 'Master Data',
      icon: <DatabaseOutlined />,
      path: '/master-data',
      subItems: [
        {
          key: '7.1',
          title: 'Plants',
          path: '/master-data/plants',
        },
        {
          key: '7.2',
          title: 'Pots & Planters',
          path: '/master-data/pots-planters',
        },
        // {
        //   key: '7.3',
        //   title: 'Maali',
        //   path: '/master-data/maali',
        // },
        {
          key: '7.5',
          title: 'Plant day care',
          path: '/master-data/plant-day-care',
        },
        // {
        //   key: '7.5',
        //   title: 'Plants on rent',
        //   path: '/master-data/plants-on-rent',
        // },
        {
          key: '7.6',
          title: 'Locations',
          path: '/master-data/locations',
        },
        // Add more sub-items as needed
      ],
    },
    {
      key: '1.1',
      title: 'Maali',
      icon: <ShopOutlined />,
      path: '/maalis',
    },
    {
      key: '2',
      title: 'Nurseries',
      icon: <ShopOutlined />,
      path: '/nurseries',
    },
    {
      key: '4',
      title: 'Customers',
      icon: <UserOutlined />,
      path: '/customers',
    },
    {
      key: '5',
      title: 'Blogging',
      icon: <TagsOutlined />,
      path: '/blogs',
    },
    // {
    //   key: '6',
    //   title: 'Services',
    //   icon: <SolutionOutlined />,
    //   path: '/services',
    //   subItems: [
    //     {
    //       key: '6.1',
    //       title: 'Maali',
    //       path: '/services/maali',
    //     },
    //     {
    //       key: '6.2',
    //       title: 'Plant day care',
    //       path: '/services/plant-day-care',
    //     },
    //     {
    //       key: '6.3',
    //       title: 'Plants on rent',
    //       path: '/services/plant-day-care',
    //     },

    //     // Add more sub-items as needed
    //   ],
    // },

    // {
    //   key: '8',
    //   title: 'Website Management',
    //   icon: <DatabaseOutlined />,
    //   path: '/website-content-management',

    // },
  ];

  const sidebarContent = (
    <>
      <div className="sidebar-header">
        <h1 className="website-name">{collapsed ? 'C' : 'Chaperone'}</h1>
      </div>
      <Menu
        theme="dark"
        selectedKeys={selectedKeys}
        openKeys={openKeys}
        onOpenChange={(keys) => setOpenKeys(keys as string[])}
        mode="inline"
      >
        {menuItems.map((item: MenuDataItem) => (
          item.subItems ? (
            <Menu.SubMenu key={item.key} icon={item.icon} title={item.title}>
              {item.subItems.map((subItem: MenuDataItem) => (
                <Menu.Item key={subItem.key}>
                  <Link to={subItem.path} onClick={onClose}>{subItem.title}</Link>
                </Menu.Item>
              ))}
            </Menu.SubMenu>
          ) : (
            <Menu.Item key={item.key} icon={item.icon}>
              <Link to={item.path} onClick={onClose}>{item.title}</Link>
            </Menu.Item>
          )
        ))}
      </Menu>
      {!collapsed && (
        <div style={{ padding: '16px', textAlign: 'center' }}>
          <Button type="primary" disabled={isLoggingOut} loading={isLoggingOut} onClick={handleLogout} icon={<LogoutOutlined />} danger>
            Logout
          </Button>
        </div>
      )}
    </>
  );

  return (
    <>
      <div className="menu-button">
        <Button
          type="primary"
          icon={<MenuOutlined />}
          onClick={showDrawer}
        />
      </div>
      <Drawer
        title="Chaperone"
        placement="left"
        onClose={onClose}
        open={visible}
        bodyStyle={{ padding: 0 }}
        className="drawer"
      >
        {sidebarContent}
      </Drawer>
      <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
        <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
          {sidebarContent}
        </Sider>
      </div>
    </>
  );
};

export default Sidebar;
