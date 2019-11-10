import React from "react";
import "./login.css";
import { Table, Tag, List, Icon, Empty, Descriptions } from "antd";
// import MomentDate from "../../../MomentDate";
import { Moment } from "moment";
// import LinkButton from "../../../LinkButton";
// import EthAddress from "../../../eth/EthAddress";
import styled from "styled-components";

function VerificationStatus({
  verified,
  name
}: {
  verified: boolean;
  name: string | JSX.Element;
}) {
  return (
    <>
      {verified ? (
        <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" />
      ) : (
        <Icon type="close-circle" theme="twoTone" twoToneColor="#eb2f96" />
      )}
      &nbsp;
      {name}
    </>
  );
}

const VerificationList = styled(List)`
  .ant-list-item {
    padding: 0;
    border-bottom: 0;
  }
`;

function VerificationPanel() {
  return (
    <VerificationList split={false}>
      <List.Item>
        <VerificationStatus verified name="Etherscan" />
      </List.Item>
      <List.Item>
        <VerificationStatus verified name="Infura" />
      </List.Item>
      <List.Item>
        {/* <VerificationStatus
          verified
          name={<LinkButton onClick={() => {}}>Verify Manually</LinkButton>} */}
        />
      </List.Item>
    </VerificationList>
  );
}

const DataDescriptions = styled(Descriptions)`
  .ant-descriptions-view table {
    table-layout: initial;
  }
`;

// const columns = [
//   {
//     title: "Date",
//     dataIndex: "timestamp",
//     key: "timestamp",
//     render: (timestamp: Moment) => <MomentDate date={timestamp} />
//   },
//   {
//     title: "Action",
//     dataIndex: "action",
//     key: "action",
//     render: (action: string) => <Tag color="green">{action}</Tag>
//   },
//   {
//     title: "Researcher",
//     dataIndex: "researcher",
//     key: "researcher",
//     render: (address: string) => <EthAddress address={address} />
//   },
//   {
//     title: "Data",
//     dataIndex: "data",
//     key: "data",
//     render: (data: Map<string, string>) => {
//       if (data.size === 0) {
//         return (
//           <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ margin: 0 }} />
//         );
//       }

//       // Map every entry in the Map to a list item
//       return (
//         <DataDescriptions column={1} size="small">
//           {Array.from(data, ([key, value]) => (
//             <Descriptions.Item key={key} label={key}>
//               {value}
//             </Descriptions.Item>
//           ))}
//         </DataDescriptions>
//       );
//     }
//   },
//   {
//     title: "Verified",
//     key: "verified",
//     render: () => <VerificationPanel />
//   }
// ];

// export default function AuditLogTable({
//   entries
// }: {
//   entries: AuditLogEntry[];
// }) {
//   return <Table columns={columns} dataSource={entries} pagination={false} />;
// }

function Dashboard() {
  return (
    <>
    
    

    
    </>
  );
}

export default Dashboard;
