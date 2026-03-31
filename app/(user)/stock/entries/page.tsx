import AddEntriesInformation from '@/components/entries/AddEntriesInformation';
import EntriesHeader from '@/components/EntriesHeader';
import React from 'react'

export type EntriesFormMode = "add" | "edit" | "view" | "delete";

const page = () => {
  return (
    <div>
        <EntriesHeader />
        
    </div>
  )
}

export default page
