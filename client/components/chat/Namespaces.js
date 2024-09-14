import { useState, useEffect } from "react";

import { useSocket } from "@/context/chat/SocketContext";
import { Namespace } from "@/components/chat/Namespace";

export const Namespaces = () => {
  const { db_namespaces } = useSocket();
  const [db_namespacesDOM, setDb_namespacesDOM] = useState();

  useEffect(() => {
    console.log("db_namespaces: ", db_namespaces);
    const namespacesDOM =
      db_namespaces?.length > 0 &&
      db_namespaces.map((ns, index) => {
        return <Namespace key={index} {...ns} />;
      });

    setDb_namespacesDOM(namespacesDOM);
  }, [db_namespaces]);

  return <div className="namespaces">{db_namespacesDOM}</div>;
};
