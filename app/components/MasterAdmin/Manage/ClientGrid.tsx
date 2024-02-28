import React from 'react';
import { Row, Col } from 'antd';
import ClientCard  from './ClientCard';
import CreateClientCard from './CreateClientCard';

interface Client {
  id: number;
  companyName: string;
  city: string;
}

interface ClientGridProps {
  clients: Client[];
}

const ClientGrid: React.FC<ClientGridProps> = ({ clients }) => (
  <Row gutter={16}>
    {clients?.map(client => (
      <Col key={client.id} xs={24} sm={12} md={8} lg={6}>
        <ClientCard name={client.companyName} location={client.city} />
      </Col>
    ))}
    <Col xs={24} sm={12} md={8} lg={6}>
      <CreateClientCard />
    </Col>
  </Row>
);

export default ClientGrid;