'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, Folder, Settings, Home, LogOut, Download, Trash2, X, FileText, Image, Video, HardDrive } from 'lucide-react'

interface FileData {
  id: string
  name: string
  size: number
  type: string
  date: string
  url: string
}

export default function Page() {
  const [files, setFiles] = useState<FileData[]>([])
  const [selectedFile, setSelectedFile] = useState<FileData | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [activeTab, setActiveTab] = useState('home')
  const router = useRouter()
  const storageLimitMB = 100
  const storageLimitBytes = storageLimitMB * 1024 * 1024

  // ✅ Load existing files from Filebase
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    if (isLoggedIn !== 'true') {
      router.push('/login')
      return
    }

    const fetchFiles = async () => {
      try {
        const res = await fetch('/api/list-files')
        const data = await res.json()
        if (data.success) {
          setFiles(data.files)
        }
      } catch (error) {
        console.error('Error fetching files:', error)
      }
    }
    fetchFiles()
  }, [router])

  // ✅ Upload file to backend → Filebase
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadProgress(0)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const uploadInterval = setInterval(() => {
        setUploadProgress(prev => (prev >= 95 ? 95 : prev + 5))
      }, 200)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      const data = await response.json()

      clearInterval(uploadInterval)
      setUploadProgress(100)
      setTimeout(() => setIsUploading(false), 500)

      if (data.success) {
        const newFile: FileData = {
          id: Date.now().toString(),
          name: file.name,
          size: file.size,
          type: file.type,
          date: new Date().toISOString(),
          url: data.fileUrl
        }
        setFiles(prev => [...prev, newFile])
      } else {
        console.error('Upload failed:', data.error)
      }
    } catch (error) {
      console.error('Upload failed:', error)
      setIsUploading(false)
    }
  }

  const handleDeleteFile = async (file: FileData) => {
    try {
      const res = await fetch('/api/delete-file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: file.name })
      })
      const data = await res.json()
      if (data.success) {
        setFiles(prev => prev.filter(f => f.name !== file.name))
        setSelectedFile(null)
      } else {
        alert('Failed to delete file')
      }
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }

  const handleDownloadFile = (file: FileData) => {
    const link = document.createElement('a')
    link.href = file.url
    link.download = file.name
    link.click()
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image className="h-10 w-10 text-gray-500" />
    if (fileType.startsWith('video/')) return <Video className="h-10 w-10 text-gray-500" />
    return <FileText className="h-10 w-10 text-gray-500" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 KB'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn')
    router.push('/')
  }

  const totalStorage = files.reduce((total, file) => total + file.size, 0)
  const storagePercentage = Math.min((totalStorage / storageLimitBytes) * 100, 100)
  
  const NavItem = ({ tab, icon: Icon, label }: { tab: string, icon: any, label: string }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
        activeTab === tab ? 'bg-gray-100 text-gray-900 font-semibold' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
      }`}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </button>
  )

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 border-r border-gray-100 bg-white flex flex-col justify-between">
        <div className="p-4">
          <div className="flex items-center space-x-2 mb-8 px-2 pt-2">
            <HardDrive className="h-6 w-6 text-gray-900" />
            <span className="text-xl font-bold text-gray-900">Vaultify</span>
          </div>
          <nav className="space-y-1">
            <NavItem tab="home" icon={Home} label="All Files" />
            <NavItem tab="uploads" icon={Upload} label="Recents" />
            <NavItem tab="albums" icon={Folder} label="Folders" />
            <NavItem tab="settings" icon={Settings} label="Settings" />
          </nav>
        </div>
        
        <div className="p-4 border-t border-gray-100 space-y-4">
          <div>
            <p className="text-xs text-gray-600 font-medium mb-1">Storage</p>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div className="bg-gray-900 h-1.5 rounded-full transition-all" style={{ width: `${storagePercentage}%` }} />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {formatFileSize(totalStorage)} of {storageLimitMB} MB used
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <header className="border-b border-gray-100 bg-white px-8 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 capitalize">{activeTab === 'home' ? 'All Files' : activeTab}</h1>
            <input
              type="text"
              placeholder="Search files..."
              className="px-4 py-2 text-sm border border-gray-200 rounded-lg w-72 focus:ring-0 focus:border-gray-400 transition-colors"
            />
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">
          {activeTab === 'home' && (
            <div className="space-y-8">
              <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center hover:shadow-sm transition-shadow">
                <input type="file" id="file-upload" className="hidden" onChange={handleFileUpload} />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">Drop files here to upload</h3>
                  <p className="text-gray-600 mb-6 text-sm">Or click to select files from your device.</p>
                  <button type="button" className="bg-gray-900 text-white px-6 py-2.5 rounded-lg hover:bg-gray-700 transition-colors font-medium text-sm">
                    Upload Files
                  </button>
                </label>
              </div>

              {isUploading && (
                <div className="max-w-xl mx-auto p-4 bg-white border border-gray-200 rounded-xl">
                  <div className="flex justify-between text-sm text-gray-700 mb-1 font-medium">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gray-900 h-2 rounded-full transition-all" style={{ width: `${uploadProgress}%` }} />
                  </div>
                </div>
              )}

              <h2 className="text-lg font-bold text-gray-900 pt-4 border-t border-gray-100">Your Files</h2>
              {files.length === 0 ? (
                <div className="text-center p-10 text-gray-500">You haven't uploaded any files yet.</div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col items-start hover:shadow-lg hover:border-gray-300 transition-all cursor-pointer"
                      onClick={() => setSelectedFile(file)}
                    >
                      <div className="flex-shrink-0 mb-3">{getFileIcon(file.type)}</div>
                      <h4 className="font-semibold text-gray-900 truncate w-full mb-1 text-sm">{file.name}</h4>
                      <p className="text-xs text-gray-600">{formatFileSize(file.size)}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{new Date(file.date).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {selectedFile && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-6 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 truncate">{selectedFile.name}</h3>
              <button onClick={() => setSelectedFile(null)} className="text-gray-500 hover:text-gray-800 transition-colors p-1 rounded-full hover:bg-gray-50">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 flex-grow overflow-auto">
              <div className="flex justify-center items-center mb-6 max-h-[50vh]">
                {selectedFile.type.startsWith('image/') ? (
                  <img src={selectedFile.url} alt={selectedFile.name} className="max-w-full max-h-full mx-auto rounded-lg object-contain" />
                ) : (
                  <div className="text-center p-12 bg-gray-50 rounded-lg w-full">
                    {getFileIcon(selectedFile.type)}
                    <p className="text-gray-600 mt-4">No preview available for this file type.</p>
                  </div>
                )}
              </div>

              <div className="space-y-3 p-4 bg-gray-50 rounded-xl text-sm border border-gray-100">
                <p className="flex justify-between text-gray-700">
                  <span className="font-medium">Size:</span> {formatFileSize(selectedFile.size)}
                </p>
                <p className="flex justify-between text-gray-700">
                  <span className="font-medium">Type:</span> {selectedFile.type}
                </p>
                <p className="flex justify-between text-gray-700">
                  <span className="font-medium">Uploaded:</span> {new Date(selectedFile.date).toLocaleString()}
                </p>
              </div>

              <div className="flex items-center justify-center space-x-4 mt-6">
                <button onClick={() => handleDownloadFile(selectedFile)} className="flex items-center space-x-2 bg-gray-900 text-white px-5 py-2.5 rounded-lg hover:bg-gray-700 transition-colors font-medium text-sm">
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </button>

                <button onClick={() => handleDeleteFile(selectedFile)} className="flex items-center space-x-2 bg-red-600 text-white px-5 py-2.5 rounded-lg hover:bg-red-700 transition-colors font-medium text-sm">
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
