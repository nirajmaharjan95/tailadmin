import { Dispatch, SetStateAction, useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { IAddEmployeeForm } from './EmployeeTable'

interface Iprops {
  setEmployees: Dispatch<SetStateAction<IAddEmployeeForm[]>>
  setIsModalOpen: Dispatch<SetStateAction<boolean>>
}

const offices = [
  'New York',
  'London',
  'Tokyo',
  'Sydney',
  'Berlin',
  'Paris',
  'Toronto',
  'San Francisco',
  'Dubai',
  'Singapore',
  'Amsterdam',
  'Chicago',
  'Hong Kong',
  'Seoul',
  'Madrid',
  'Rome',
  'Los Angeles',
  'Vancouver',
  'Bangkok',
  'Shanghai',
  'Melbourne',
  'Dublin',
  'Stockholm',
  'Zurich',
  'Barcelona',
  'Vienna',
  'Mumbai',
  'Cape Town',
  'Buenos Aires',
  'Lisbon',
]

const AddEmployeeModal = (props: Iprops) => {
  const { setEmployees, setIsModalOpen } = props
  const { register, handleSubmit } = useForm<IAddEmployeeForm>()
  const onSubmit: SubmitHandler<IAddEmployeeForm> = async (data) => {
    return await addEmployee(data)
  }

  const addEmployee = async (data: IAddEmployeeForm) => {
    try {
      const response = await fetch('http://localhost:4000/api/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      if (response.ok) {
        const newEmployee = await response.json()
        setEmployees((prev) => [...prev, newEmployee])
        setIsModalOpen(false)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
        Personal Information
      </h4>

      <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
        <div className="col-span-1">
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            First Name
          </label>
          <input
            type="text"
            placeholder="Firstname"
            {...register('first_name')}
            className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
          />
        </div>

        <div className="col-span-1">
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Last Name
          </label>
          <input
            type="text"
            placeholder="Lastname"
            {...register('last_name')}
            className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
          />
        </div>

        <div className="col-span-1">
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            age
          </label>
          <input
            type="number"
            placeholder="18"
            {...register('age')}
            className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
          />
        </div>

        <div className="col-span-1">
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Salary
          </label>
          <input
            type="number"
            placeholder="123456"
            {...register('salary')}
            className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
          />
        </div>

        <div className="col-span-1">
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            position
          </label>
          <select>
            {offices.map((item) => {
              return item
            })}
          </select>
        </div>

        <div className="col-span-1">
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Office
          </label>
          <input
            type="text"
            placeholder="Office"
            {...register('office')}
            className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
          />
        </div>

        <div className="col-span-1">
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Phone Number
          </label>
          <input
            type="text"
            placeholder="+09 363 398 46"
            {...register('phone')}
            className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
          />
        </div>
      </div>

      <button
        type="submit"
        className="mt-6 flex justify-center w-full px-4 py-3 text-sm font-medium text-white rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 sm:w-auto"
      >
        Save Changes
      </button>
    </form>
  )
}

export default AddEmployeeModal
