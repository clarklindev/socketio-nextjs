import { useSocket } from "@/context/chat/SocketContext";
import { Namespace } from "@/components/chat/Namespace";

export const Namespaces = () => {
  const { db_namespaces } = useSocket();

  const namespacesDOM =
    db_namespaces?.length > 0 &&
    db_namespaces.map((ns, index) => {
      return <Namespace key={index} {...ns} />;
    });

  return <div className="namespaces">{namespacesDOM}</div>;
};
