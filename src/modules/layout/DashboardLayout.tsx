import cx from 'classnames'
import { ReactNode } from 'react'
import { IoLeafSharp } from 'react-icons/io5'

import { FormInput } from '@/components/FormInput'
import { HeaderLogin } from '@/components/HeaderLogin'
import ThemeSwitch from '@/components/ThemeSwitch'
import { Breadcrumbs } from '@/modules/breadcrumbs/Breadcrumbs'

export type DashboardLayoutProps = {
  children?: ReactNode
  header?: ReactNode
  title?: string
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  header,
  title,
}) => {
  return (
    <>
      {/*
        <nav className="bg-surface-1 border-r border-surface-2 md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-nowrap md:overflow-hidden flex flex-wrap items-center justify-between relative md:w-64 z-10 py-4 px-6">
          <div className="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto">
            <button
              className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
              type="button"
            ></button>
            <a
              className="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0"
              href="#/"
            >
              Notus React
            </a>
            <ul className="md:hidden items-center flex flex-wrap list-none">
              <li className="inline-block relative">
                <div className="hidden bg-white text-base z-50 float-left py-2 list-none text-left rounded shadow-lg mt-1 min-w-48">
                  <a
                    className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
                    href="#pablo"
                  >
                    Action
                  </a>
                  <a
                    className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
                    href="#pablo"
                  >
                    Another action
                  </a>
                  <a
                    className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
                    href="#pablo"
                  >
                    Something else here
                  </a>
                  <div className="h-0 my-2 border border-solid border-blueGray-100">
                    &nbsp;
                  </div>
                  <a
                    className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
                    href="#pablo"
                  >
                    Seprated link
                  </a>
                </div>
              </li>
              <li className="inline-block relative">
                <div className="items-center flex">
                  <span className="w-12 h-12 text-sm text-white bg-blueGray-200 inline-flex items-center justify-center rounded-full">
                    <img
                      className="w-full rounded-full align-middle border-none shadow-lg"
                      src="/notus-react/static/media/team-1-800x800.fa5a7ac2.jpg"
                      alt="..."
                    />
                  </span>
                </div>
                <div className="hidden bg-white text-base z-50 float-left py-2 list-none text-left rounded shadow-lg min-w-48">
                  <a
                    className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
                    href="#pablo"
                  >
                    Action
                  </a>
                  <a
                    className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
                    href="#pablo"
                  >
                    Another action
                  </a>
                  <a
                    className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
                    href="#pablo"
                  >
                    Something else here
                  </a>
                  <div className="h-0 my-2 border border-solid border-blueGray-100">
                    &nbsp;
                  </div>
                  <a
                    className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
                    href="#pablo"
                  >
                    Seprated link
                  </a>
                </div>
              </li>
            </ul>
            <div className="md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded hidden">
              <div className="md:min-w-full md:hidden block pb-4 mb-4 border-b border-solid border-blueGray-200">
                <div className="flex flex-wrap">
                  <div className="w-6/12">
                    <a
                      className="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0"
                      href="#/"
                    >
                      Notus React
                    </a>
                  </div>
                  <div className="w-6/12 flex justify-end">&nbsp;</div>
                </div>
              </div>
              <form className="mt-6 mb-4 md:hidden">
                <div className="mb-3 pt-0">
                  <input
                    className="px-3 py-2 h-12 border border-solid  border-blueGray-500 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-base leading-snug shadow-none outline-none focus:outline-none w-full font-normal"
                    type="text"
                    placeholder="Search"
                  />
                </div>
              </form>
              <hr className="my-4 md:min-w-full" />
              <h6 className="md:min-w-full text-blueGray-500 text-xs uppercase font-bold block pt-1 pb-4 no-underline">
                Admin Layout Pages
              </h6>
              <ul className="md:flex-col md:min-w-full flex flex-col list-none">
                <li className="items-center">
                  <a
                    className="text-xs uppercase py-3 font-bold block text-sky-500 hover:text-sky-600"
                    href="#/admin/dashboard"
                  >
                    {' '}
                    Dashboard
                  </a>
                </li>
                <li className="items-center">
                  <a
                    className="text-xs uppercase py-3 font-bold block text-blueGray-700 hover:text-blueGray-500"
                    href="#/admin/settings"
                  >
                    {' '}
                    Settings
                  </a>
                </li>
                <li className="items-center">
                  <a
                    className="text-xs uppercase py-3 font-bold block text-blueGray-700 hover:text-blueGray-500"
                    href="#/admin/tables"
                  >
                    {' '}
                    Tables
                  </a>
                </li>
                <li className="items-center">
                  <a
                    className="text-xs uppercase py-3 font-bold block text-blueGray-700 hover:text-blueGray-500"
                    href="#/admin/maps"
                  >
                    {' '}
                    Maps
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
       */}
      <div className="relative pb-24">
        <nav className="absolute top-0 left-0 w-full z-10 bg-surface-1 border-b border-surface-2 md:flex-row md:flex-nowrap md:justify-start flex items-center px-4 py-3">
          <div className="w-full mx-auto items-center flex justify-between md:flex-nowrap flex-wrap md:px-10 px-4">
            <span className="font-bold flex">
              <IoLeafSharp className="w-5 h-5 mr-1 relative top-0.5 text-green-300" />{' '}
              WOWLEAF
            </span>

            <form className="hidden md:flex flex-row flex-wrap items-center lg:ml-auto mr-3">
              <div className="relative flex w-full flex-wrap items-stretch">
                <FormInput name="search" placeholder="Search..." />
              </div>
            </form>
            <div className="items-center hidden md:flex">
              <ThemeSwitch />
              <span className="ml-4 w-12 h-12 text-sm text-white bg-blueGray-200 inline-flex items-center justify-center rounded-full">
                <img
                  className="w-full rounded-full align-middle border-none shadow-lg"
                  src="https://via.placeholder.com/150"
                  alt="..."
                />
              </span>
              <HeaderLogin />
            </div>
          </div>
        </nav>
        <div className="relative md:pt-32 pb-12 pt-12">
          <div className="container mx-auto">
            <div className="px-4 md:px-10 mx-auto w-full">
              <div className="flex flex-wrap">
                <div className="w-full px-4">
                  {title && (
                    <h1
                      className={cx('font-bold text-4xl', {
                        'sr-only': !!header,
                      })}
                    >
                      {title}
                    </h1>
                  )}
                  {header && header}
                </div>
                <div className="w-full px-4 mt-4">
                  <Breadcrumbs />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container mx-auto">
          <div className="px-4 md:px-10 mx-auto w-full">
            <div className="flex flex-wrap">
              <div className="w-full px-4">
                <div className="relative flex flex-col min-w-0 break-words w-full">
                  {children}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
