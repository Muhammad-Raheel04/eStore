import { Input } from '@/components/ui/input'
import API from '@/utils/API'
import { Search } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import UserLogo from '@/assets/user.jpg'
import { Skeleton } from '@/components/ui/skeleton'


const AdminUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("");
  const getAllUsers = async () => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      setLoading(true);
      const res = await API.get('/user/all-user', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      if (res.data.success) {
        setUsers(res.data.users)
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  }
  const filteredUsers = users.filter(user =>
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLocaleLowerCase())
  )
  useEffect(() => {
    getAllUsers()
  }, [])
  return (
    <div className='pl-[350px] py-20 pr-20 mx-auto px-4'>
      <h1 className='font-bold text-2xl text-center'>User Management</h1>
      <p className='text-center'>View and manage registered users</p>
      <div className='flex relative w-[300px] mt-6'>
        <Search className='absolute left-2 top-1 text-gray-600 w-5' />
        <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className='pl-10' placeholder="Search Users..." />
      </div>
      <div className='grid grid-cols-2 gap-7 mt-7'>
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className='bg-gray-300 p-5 '>
              <div className='flex items-center gap-2'>
                <Skeleton className='rounded-full w-16 h-16' />
                <div>
                  <Skeleton className='w-[150px] h-4 mb-2' />
                  <Skeleton className='w-[200px] h-4' />
                </div>
              </div>
              <div className='flex gap-3 mt-3'>
                <Skeleton className='w-[80px] h-10' />
                <Skeleton className='w-[100px] h-10' />
              </div>
            </div>
          ))
        ) : (
          filteredUsers.map((user) => {
            return (
              <div key={user._id} className='bg-gray-200 border border-black p-5'>
                <div className='flex items-center gap-2'>
                  <img src={user.profilePic || UserLogo} alt="" className='rounded-full w-16 aspect-square object-cover border border-black' />
                  <div>
                    <h1 className='font-semibold'>@{user.firstName} {user.lastName}</h1>
                    <h3>{user.email}</h3>
                  </div>
                </div>
              </div>
            )
          })
        )}
        {!loading && users.length === 0 && (
          <p className='col-span-3 text-center text-gray-500'>No users found.</p>
        )}
      </div>
    </div>
  );
}

export default AdminUsers