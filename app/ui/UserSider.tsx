import React, {useState, useEffect} from 'react';
import { Layout, Menu, MenuProps } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import useLoggedInUser from '@/app/hooks/useLoggedInUser';
import { useSelector , useDispatch} from 'react-redux';
import { RootState } from '@/redux/reducers/store';
import useFetchApi from '@/app/hooks/useFetchApi'; 
import { updateSelectedUserMailboxInUserDashboard } from '@/redux/reducers/editFormDataReducer';

const { Sider } = Layout;

const UserSider: React.FC = () => {
        const dispatch = useDispatch();
        const [collapsed, setCollapsed] = useState(false);
        const { fetchApi } = useFetchApi();
        const [sideMenuItems, setSideMenuItems] = useState<MenuProps['items']>([]);

        useLoggedInUser();
        const loggedInUserData = useSelector((state: RootState) => state.loggedInUser);
        
        useEffect(() => {
                const fetchData = async () => {
                    try {
                        const whereConditions = [
                            { columnName: 'userEmail', columnValue: loggedInUserData.user[0].userEmail},
                        ];
                        const responseData = await fetchApi(`${process.env.NEXT_PUBLIC_API_URL}/users?userEmail=${loggedInUserData.user[0].userEmail}`);
                        const emailArray = responseData[0].userMailboxesAccess.split(', ');

                        const newSideMenuItems: MenuProps['items'] = emailArray.map((email: any, index: any) => ({
                                key: (index + 1).toString(), // Convert index to string and use as key
                                label: email, // Use email as label
                                icon: React.createElement(MailOutlined), // Use FileOutlined as icon for all items
                            }));

                        setSideMenuItems(newSideMenuItems);
                    } catch (fetchError) {
                        console.error('Fetch error:', fetchError);
                    }
                };
        
                fetchData();
            }, [fetchApi, loggedInUserData]);

            const handleMenuClick = (e: any) => {
                const clickedItem = sideMenuItems?.find(item => item?.key === e.key);
                if (clickedItem && 'label' in clickedItem) {
                    console.log('clicked item label:', clickedItem.label);
                    dispatch(updateSelectedUserMailboxInUserDashboard(clickedItem.label));
                }
                
            }
        return (
                <Sider width={200} collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                        <Menu
                                mode="inline"
                                defaultSelectedKeys={['1']}
                                defaultOpenKeys={['sub1']}
                                style={{ height: '100%', borderRight: 0 }}
                                items={sideMenuItems}
                                onClick={handleMenuClick}
                        />
                </Sider>
        );
}

export default UserSider;