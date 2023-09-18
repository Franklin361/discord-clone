import { useSocket } from '@/components/providers/socket-provider';
import { useInfiniteQuery } from '@tanstack/react-query';
import qs from 'query-string';

interface Props {
  paramKey: 'channelId' | 'conversationId'
  apiUrl: string
  queryKey: string
  paramValue: string
}

export const useChatQuery = ({
  apiUrl, 
  paramValue,
  queryKey,
  paramKey
}:Props) => {
  
  const { isConnected } = useSocket()
  
  const fetchMessages =  async( { pageParam = undefined} ) => {
     const url = qs.stringifyUrl({
      url: apiUrl,
      query: {
        cursor: pageParam,
        [paramKey]: paramValue
      }
     },{ skipNull: true })

     const res = await fetch(url)
     return res.json()  
  }

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status
  } = useInfiniteQuery({
    queryKey: [queryKey],
    queryFn: fetchMessages,
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
    refetchInterval: isConnected ? false: 1000
  })


  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status
  }
}