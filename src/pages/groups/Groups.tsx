import { Group, getGroups as getGroupsApi } from "@/api/groups";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Groups() {
  const [groups, setGroups] = useState<Group[]>([])
  const { useGroup, groupId } = useAuth();

  const navigate = useNavigate();

  const fetchGroups = async() => {
    const data = await getGroupsApi()
    setGroups(data)
  }

  const onGroupClick = (group:Group) => {
    useGroup(group.id)
    navigate('/')
  }

  useEffect(() => {
    console.log("excuse me")
    fetchGroups()
  }, [])

  return (
    <div>
      {groups.map((group:Group) => (
        <div key={group.id} className={"my-4 bg-gray-800 hover:bg-gray-700 p-4 cursor-pointer" + (group.id == groupId ? " outline-2 outline-offset-2 outline-solid outline-white" : "")} onClick={() => onGroupClick(group)}>
          <span className="font-bold">{group.name}</span>, <span>{group.description}</span>
        </div>
      ))}
    </div>
  )
}