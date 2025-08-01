import { useState } from "react";
import AddConnectionModal from "./AddConnectionModal";
import type { Connection } from "@/types/connection";
import { getDBColor, getDBIcon } from "@/utils/connection";
import { LoaderPinwheel, Plug, Plus, Trash2 } from "lucide-react";
import Image from "next/image";

interface ConnectionsTabProps {
  onActivateConnection: (id: string, dbType: string) => Promise<void>
  onDeactivateConnection: (id: string) => Promise<void>
  onRefresh: () => Promise<void>
  onDelete: (id: string, isActive: boolean) => Promise<void>
  loading: boolean
  connections: Connection[]
  activeLoading: boolean
}


export default function ConnectionsTab({
  loading,
  activeLoading, 
  connections, 
  onDelete, 
  onRefresh,
  onActivateConnection,
  onDeactivateConnection,

}: ConnectionsTabProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [changingId, setChangingId] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-slate-200 rounded w-1/2 mb-6"></div>
          <div className="bg-white rounded-xl p-6">
            <div className="h-6 bg-slate-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-slate-200 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-slate-200 rounded w-1/3 mb-2"></div>
                    <div className="h-3 bg-slate-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Connections List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-semibold text-slate-800">
            {connections.length > 0 ? 'Active Connections' : 'No Connections'}
          </h3>
          <button
              title="New Connection"
              onClick={() => setShowAddModal(true)}
              className="bg-blue-500 hover:bg-blue-700 text-white px-2 py-2 rounded-full transition-colors"
            >
              <Plus />
            </button>
        </div>
        
        {connections.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plug className="text-slate-400"/>
            </div>
            <h3 className="text-lg font-medium text-slate-800 mb-2">No connections yet</h3>
            <p className="text-slate-600 mb-6">Get started by adding your first database connection</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Add Connection
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {connections.map((connection: Connection) => (
              <div key={connection.id} className="px-6 py-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getDBColor(connection.dbType)}`}>
                      <Image src={getDBIcon(connection.dbType)} alt={connection.dbType} width={20} height={20}/>
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-800">{connection.connName}</h4>
                      <div className="flex items-center space-x-4 text-sm text-slate-500 mt-1">
                        <span>{connection.host}:{connection.port}</span>
                        <span>{connection.dbName}</span>
                        <span>{connection.username}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={async () => {
                        setChangingId(connection.id);
                        if (connection.isActive) {
                          await onDeactivateConnection(connection.id);
                        } else {
                          await onActivateConnection(connection.id, connection.dbType);
                        }
                        setChangingId(null);
                      }}
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium focus:outline-none transition-colors ${
                        connection.isActive
                          ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                      disabled={activeLoading || changingId === connection.id}
                      title={connection.isActive ? 'Disconnect' : 'Connect'}
                    >
                      {changingId === connection.id ? (
                        <LoaderPinwheel className="w-4 h-4 mr-1 animate-spin" />
                      ) : (
                        <div className={`w-2 h-2 rounded-full mr-1 ${
                          connection.isActive ? 'bg-emerald-500' : 'bg-slate-400'
                        }`}></div>
                      )}
                      {connection.isActive ? 'Connected' : 'Connect'}
                    </button>
                    {!loading ?
                    <button
                      onClick={() => onDelete(connection.id, connection.isActive)}
                      className="text-red-500 p-2 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4"/>
                    </button> : <LoaderPinwheel className="animate-spin"/>
                    }
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAddModal && (
        <AddConnectionModal onClose={() => setShowAddModal(false)} refreshConnections={onRefresh}/>
      )}
    </div>
  );
}