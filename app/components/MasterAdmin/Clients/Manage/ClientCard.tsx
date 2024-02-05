import Link from "next/link";
interface ClientCardProps {
  name: string;
  location: string;
}

const ClientCard: React.FC<ClientCardProps> = ({ name, location }) => (
  <Link href={`/dashboard/manage/edit-client?client=${encodeURIComponent(name)}`}>
    <div className='flex mb-5 items-center h-48 max-w-64 border rounded-md cursor-pointer hover:shadow-lg transition-shadow duration-200 ease-in'>
      <div className="text-left p-4">
        <p className='text-blue-900 text-xl font-bold'>{name}</p>
        <p className='text-blue-900 text-base'>{location}</p>
      </div>
    </div>
  </Link>
);

export default ClientCard;
