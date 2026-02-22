import React from 'react'
import ListTab from './ListTab'
import { fetchCurrentUserLikeIds, fetchLikedMembers } from '../actions/likeActions'

export default async function ListsPage({searchParams}
  : {searchParams: Promise<{type: string}>}) {

  const {type} = await searchParams;

  const likeIds = await fetchCurrentUserLikeIds();
  const members = await fetchLikedMembers(type);

  return (
    <ListTab members={members} likeIds={likeIds}/>
  )
}
