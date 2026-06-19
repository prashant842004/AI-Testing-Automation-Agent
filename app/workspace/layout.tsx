import React from 'react'
import WorkspaceHeader from '@/components/custom/WorkspaceHeader'
export default function workspacelayout({ children }: {
    children: React.ReactNode;
}) {
    return (
        <div>
            <WorkspaceHeader />
            {children}
        </div>
    )
}
