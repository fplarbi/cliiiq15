

import React from 'react'
import { getMembers } from '../actions/memberActions';
import MemberCard from './MemberCard';
import { fetchCurrentUserLikeIds } from '../actions/likeActions';
import PaginationComponet from '@/components/PaginationComponet';
import { GetMemberParams } from '@/types';
import EmptyState from '@/components/EmptyState';

export default async function MembersPage({searchParams}: {searchParams: GetMemberParams}) {

  const memberParam =  await searchParams;

  const {items: members, totalCount} = await getMembers(memberParam);
  const likeIds = await fetchCurrentUserLikeIds();

  return (
    <>
    {!members || members.length === 0 ? (
      <EmptyState />
    ) : (
      <>
          <div className='mt-10 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-8'>
        {members && members?.map((member) => (
          <MemberCard key={member.id} member={member} likeIds={likeIds} />
        ))}
      </div>
      <PaginationComponet totalCount={totalCount}/>
      </>
    )}
    </>
  )
}
