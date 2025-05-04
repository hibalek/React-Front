import { useParams } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import ReadOnlyChat from "../../components/chat/ReadOnlyChat";

const sampleMessages = [
  {
    id: 1,
    sender: { name: "John", image: "/images/user/user-17.jpg" },
    content: "Bonjour, comment allez-vous ?",
    timestamp: "10:15 AM",
  },
  {
    id: 2,
    sender: { name: "Sarah", image: "/images/user/user-18.jpg" },
    content: "Très bien merci, et vous ?",
    timestamp: "10:16 AM",
  },
];

export default function AdminChatViewer() {
  const { conversationId } = useParams();

  return (
    <>
      <PageMeta title="Salon de communication" description="Lecture seule du salon" />
      <PageBreadcrumb pageTitle={`Conversation ID: ${conversationId}`} />
      <ComponentCard title="Salon de communication (lecture seule)">
        <ReadOnlyChat messages={sampleMessages} />
      </ComponentCard>
    </>
  );
}
