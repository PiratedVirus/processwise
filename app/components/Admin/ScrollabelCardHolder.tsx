import React, { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useDispatch } from 'react-redux';
import { MailOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import CustomCard from '@/app/ui/CustomCard';
import useFetchApiV2 from '@/app/hooks/useFetchApiV2';
import { updateClientConfiguredMailboxes, updateDashboardSelectedMailbox } from '@/redux/reducers/editFormDataReducer';
import  CustomCardSkeleton  from '@/app/ui/CustomCardSkeleton';
const ScrollableCardHolder: React.FC = () => {

  const { data: session } = useSession();
  const dispatch = useDispatch();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const userCompany = session?.user?.userCompany;
  const { data: mailboxData, isLoading, isError } = useFetchApiV2(`${process.env.NEXT_PUBLIC_API_URL}/clients?companyName=${userCompany}`);

  useEffect(() => {
    if (mailboxData && mailboxData[0]?.configuredMailboxes) {
      console.log("mailboxes 77 inside if ")
      const mailboxes = JSON.parse(mailboxData[0].configuredMailboxes);
      console.log('mailboxes 778', mailboxes, "type is ", typeof mailboxes);
      dispatch(updateClientConfiguredMailboxes(mailboxes));
    }
  }, [mailboxData, dispatch]);

  const handleCardClick = (headerText: string) => {
    setSelectedCard(headerText);
    dispatch(updateDashboardSelectedMailbox(headerText));
  };

  const scroll = (scrollOffset: number) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft += scrollOffset;
    }
  };

  if (isLoading) return <CustomCardSkeleton  />;
  if (isError) return <div>Failed to load</div>;

  const clientMailboxData = mailboxData && mailboxData[0]?.configuredMailboxes ? JSON.parse(mailboxData[0].configuredMailboxes) : [];


    return (
        <div className="flex flex-col items-center relative w-full bg-neutral-100">
          <div className="flex items-center justify-center w-full">
            <button onClick={() => scroll(-200)} className="relative z-10 m-2">
              <LeftOutlined style={{ fontSize: '1.5rem', color: 'rgba(0, 0, 0, 0.5)' }} />
            </button>
            
            <div ref={scrollContainerRef} className="flex overflow-auto scrollbar-hide my-5 px-10 pt-3" style={{ scrollBehavior: "smooth", overflowY: 'hidden' }}>
              {clientMailboxData.map((card: any, index: number) => (
                <CustomCard
                  key={index}
                  headerText={card}
                  icon={<MailOutlined style={{ fontSize: '1.5rem', marginRight: '1rem' }} />}
                  selected={selectedCard === card}
                  onSelect={() => handleCardClick(card)}
                />
              ))}
            </div>
  
            <button onClick={() => scroll(200)} className="relative z-10 m-2">
              <RightOutlined style={{ fontSize: '1.5rem', color: 'rgba(0, 0, 0, 0.5)' }} />
            </button>
          </div>
        </div>
    );
};

export default ScrollableCardHolder;
