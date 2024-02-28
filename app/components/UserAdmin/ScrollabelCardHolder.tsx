import React, { useState, useRef, useEffect } from 'react';
import { MailOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import CustomCard from '@/app/ui/CustomCard';
import useFetchApi from '@/app/hooks/useFetchApi';
import useLoggedInUser from '@/app/hooks/useLoggedInUser';
import { useDispatch, useSelector } from 'react-redux';
import { updateClientConfiguredMailboxes, updateDashboardSelectedMailbox } from '@/redux/reducers/editFormDataReducer';

const ScrollableCardHolder: React.FC = () => {
    useLoggedInUser();
    const loggedInUserData = useSelector((state: any) => state.loggedInUser);
    const { fetchApi } = useFetchApi();
    const dispatch = useDispatch();
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [selectedCard, setSelectedCard] = useState<string | null>(null);
    const [clientMailboxData, setClientMailboxData] = useState<any>(null);
  

    useEffect(() => {
      if(loggedInUserData) {
        console.log('loggedInUserData ****', JSON.stringify(loggedInUserData.user[0]))
        const fetchData = async () => {
          try {
            const whereCondition = [
                { columnName: 'companyName', columnValue: loggedInUserData.user[0].userCompany }
            ];
            console.log('whereCondition', JSON.stringify(whereCondition))

            const mailboxResponseData = await fetchApi(`${process.env.NEXT_PUBLIC_API_URL}/fetch`, 'POST', { modelName: 'ClientDetail', conditions: whereCondition});
            setClientMailboxData(mailboxResponseData[0].configuredMailboxes);
            dispatch(updateClientConfiguredMailboxes(mailboxResponseData[0].configuredMailboxes));
            console.log('mailboxResponseData', JSON.stringify(mailboxResponseData[0]))
          } catch (fetchError) {
            console.error('Fetch error:', fetchError);
          }
        };
  
        fetchData();
      }
    }, [loggedInUserData, fetchApi, dispatch]);
  
    const handleCardClick = (headerText: string) => {
      setSelectedCard(headerText);
      dispatch(updateDashboardSelectedMailbox(headerText)); // Dispatch action with the selected card's headerText
    };

    const scroll = (scrollOffset: number) => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollLeft += scrollOffset;
      }
    };

    return (
        <div className="flex flex-col items-center relative w-full bg-neutral-100">
          <div className="flex items-center justify-center w-full">
            <button onClick={() => scroll(-200)} className="relative z-10 m-2">
              <LeftOutlined style={{ fontSize: '1.5rem', color: 'rgba(0, 0, 0, 0.5)' }} />
            </button>
            
            <div ref={scrollContainerRef} className="flex overflow-auto scrollbar-hide my-5 px-10 pt-3" style={{ scrollBehavior: "smooth", overflowY: 'hidden' }}>
              {JSON.parse(clientMailboxData)?.map((card: any, index: number) => (
                <CustomCard
                  key={index}
                  headerText={card} // Make sure this matches your data structure
                  icon={<MailOutlined style={{ fontSize: '1.5rem', marginRight: '1rem' }} />}
                  selected={selectedCard === card}
                  onSelect={() => handleCardClick(card)} // Pass the headerText to handleCardClick
                />
              ))}
            </div>
  
            <button onClick={() => scroll(200)} className="relative z-10 m-2">
              <RightOutlined style={{ fontSize: '1.5rem', color: 'rgba(0, 0, 0, 0.5)' }} />
            </button>
          </div>
        </div>
    );
}

export default ScrollableCardHolder;
