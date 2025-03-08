import { useEffect, useState } from "react";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../../authentication/AuthProvider";

export default function useInfiniteScroll(token, value, pageNumber, type, newNoti) {
  const {fetch} = useContext(AuthContext)
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setNotifications([]);
  }, [value, newNoti]);

  useEffect(() => {
    async function fetchNotis() {
      setLoading(true);
      const data = await fetch(token, axios.get(`${import.meta.env.VITE_APP_API_URL}/api/v1/notifications?isRead=${value}&type=${type}&skip=${(pageNumber-1)*5}&limit=5`, {
        headers: { Authorization: `Bearer ${token.accessToken}` },
      }))
      if (data) {
        setNotifications((notis) => {
          return [
            ...new Set([...notis, ...data]),
          ];
        });
        setHasMore(data.length > 0);
        setLoading(false);
      }

      // try {
      //   setLoading(true);
      //   const response = await axios.get(`http://localhost:3000/api/v1/notifications?isRead=${value}&type=${type}&skip=${(pageNumber-1)*5}&limit=5`, {
      //     headers: { Authorization: `Bearer ${token.accessToken}` },
      //   });
      //   if (response) {
      //     setNotifications((notis) => {
      //       return [
      //         ...new Set([...notis, ...response.data]),
      //       ];
      //     });
      //     setHasMore(response.data.length > 0);
      //     setLoading(false);
      //   }
      // } catch (error) {
      //   console.error(error)
      // }
    }
    fetchNotis();
  }, [value, pageNumber, newNoti]);

  return { loading, notifications, hasMore };
}
