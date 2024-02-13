import React, {useState, useRef} from 'react';
import { MailOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import CustomCard from '@/app/ui/CustomCard';
const cardData = [
    {
        id: "1",
      headerText: "mailBoxOne@processwise.ai",
      subText: "13 users",
      headerTextSize: "text-lg",
      height: "24",
      width: "55",
      link: "/user/it-admin",
      icon: <MailOutlined style={{ fontSize: '1.5rem', marginRight: '1rem' }} />,
    },
    {
        id: "2",
      headerText: "mailBoxTwo@processwise.ai",
      subText: "3 users",
      headerTextSize: "text-lg",
      height: "24",
      width: "96",
      link: "/user/it-admin",
      icon: <MailOutlined style={{ fontSize: '1.5rem', marginRight: '1rem' }} />,
    },
    // Add 3 more entries as per your requirement
    {
        id: "3",
      headerText: "mailBoxThree@processwise.ai",
      subText: "8 users",
      headerTextSize: "text-lg",
      height: "24",
      width: "96",
      link: "/user/it-admin",
      icon: <MailOutlined style={{ fontSize: '1.5rem', marginRight: '1rem' }} />,
    },
    {
        id: "4",
      headerText: "mailBoxFour@processwise.ai",
      subText: "5 users",
      headerTextSize: "text-lg",
      height: "24",
      width: "96",
      link: "/user/it-admin",
      icon: <MailOutlined style={{ fontSize: '1.5rem', marginRight: '1rem' }} />,
    },
    {
        id: "5",
      headerText: "mailBoxFive@processwise.ai",
      subText: "2 users",
      headerTextSize: "text-lg",
      height: "44",
      width: "96",
      link: "/user/it-admin",
      icon: <MailOutlined style={{ fontSize: '1.5rem', marginRight: '1rem' }} />,
    }
  ];

const ScrollabelCardHolder: React.FC = () => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [selectedCard, setSelectedCard] = useState<string | null>(null);
  
    const handleCardClick = (id: string) => {
      setSelectedCard(id);
    };
    const scroll = (scrollOffset: number) => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollLeft += scrollOffset;
      }
    };
    return (
        <div className="flex flex-col items-center relative w-full bg-neutral-100 "> {/* Adjusted for relative positioning */}
        {/* Container for cards and buttons */}
        <div className="flex items-center justify-center w-full">
          {/* Left Scroll Button */}
          <button
            onClick={() => scroll(-200)}
            className="relative z-10 m-2" // Adjusted for better alignment
          >
            <LeftOutlined style={{ fontSize: '1.5rem', color: 'rgba(0, 0, 0, 0.5)' }} />
          </button>
          
          {/* Scrollable Container for Cards */}
          <div
            ref={scrollContainerRef}
            className="flex overflow-auto scrollbar-hide my-5 px-10 pt-3" // Added padding for buttons
            style={{ scrollBehavior: "smooth" }}
          >
            {cardData.map((card, index) => (
              <CustomCard
                key={index}
                headerText={card.headerText}
                // subText={card.subText}
                customHeight={card.height}
                customWidth={card.width}
                link={card.link}
                icon={card.icon}
                selected={selectedCard === card.id}
                onSelect={() => handleCardClick(card.id)}
              />
            ))}
          </div>
  
          {/* Right Scroll Button */}
          <button
            onClick={() => scroll(200)}
            className="relative z-10 m-2" // Adjusted for better alignment
          >
            <RightOutlined style={{ fontSize: '1.5rem', color: 'rgba(0, 0, 0, 0.5)' }} />
          </button>
        </div>
      </div>
    );
}

export default ScrollabelCardHolder;