'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  ArrowLeft, 
  Phone, 
  Mail, 
  Calendar,
  AlertCircle,
  Star,
} from 'lucide-react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Money04Icon } from '@hugeicons/core-free-icons';
import Link from 'next/link';

// Import document components





import DocumentsTab from './Documentstab';
import DriverLicenseView from './DriverLicenseView';
import VehicleInfoView from './VehicleInfoView';
import VehicleInsuranceView from './VehicleInsuranceView';
import VehicleRegistrationView from './VehicleRegistrationView';

type TabType = 'Profile' | 'Documents' | 'History' | 'Reports';
type DocumentViewType = 'license' | 'vehicle-info' | 'insurance' | 'registration' | null;

const DriverDetails = () => {
  const [activeTab, setActiveTab] = useState<TabType>('Profile');
  const [documentView, setDocumentView] = useState<DocumentViewType>(null);

  // Mock data for history
  const historyData = [
    {
      id: 1,
      name: 'Esther Howard',
      car: 'Toyota Sienna LE',
      status: 'Canceled',
      fare: '$5.00',
      rating: 4.5,
      image: '/profile.svg'
    },
    {
      id: 2,
      name: 'Kathryn Murphy',
      car: 'Toyota Sienna LE',
      status: 'Completed',
      fare: '$5.00',
      rating: 4.5,
      image: '/profile.svg'
    },
    {
      id: 3,
      name: 'Cody Fisher',
      car: 'Toyota Sienna LE',
      status: 'Completed',
      fare: '$5.00',
      rating: 4.5,
      image: '/profile.svg'
    },
    {
      id: 4,
      name: 'Marvin McKinney',
      car: 'Toyota Sienna LE',
      status: 'Canceled',
      fare: '$5.00',
      rating: 4.5,
      image: '/profile.svg'
    },
    {
      id: 5,
      name: 'Jerome Bell',
      car: 'Toyota Sienna LE',
      status: 'Completed',
      fare: '$5.00',
      rating: 4.5,
      image: '/profile.svg'
    },
    {
      id: 6,
      name: 'Leslie Alexander',
      car: 'Toyota Sienna LE',
      status: 'Completed',
      fare: '$5.00',
      rating: 4.5,
      image: '/profile.svg'
    }
  ];

  // Mock data for reports
  const reportsData = [
    {
      id: 1,
      name: 'Kristin Watson',
      role: 'Driver',
      comment: 'Great rider! Friendly, respectful, and easy to communicate with. Would be happy to drive them again.',
      image: '/profile.svg'
    },
    {
      id: 2,
      name: 'Guy Hawkins',
      role: 'Driver',
      comment: 'Great rider! Friendly, respectful, and easy to communicate with. Would be happy to drive them again.',
      image: '/profile.svg'
    },
    {
      id: 3,
      name: 'Marvin McKinney',
      role: 'Driver',
      comment: 'Great rider! Friendly, respectful, and easy to communicate with. Would be happy to drive them again.',
      image: '/profile.svg'
    },
    {
      id: 4,
      name: 'Arlene McCoy',
      role: 'Driver',
      comment: 'Great rider! Friendly, respectful, and easy to communicate with. Would be happy to drive them again.',
      image: '/profile.svg'
    }
  ];

  const handleViewDocument = (type: DocumentViewType) => {
    setDocumentView(type);
  };

  const handleBackToDocuments = () => {
    setDocumentView(null);
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    if (tab !== 'Documents') {
      setDocumentView(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F4F4F6]">
      {/* Left Sidebar Spacer */}
      <div className="flex-shrink-0" />

      {/* Main Content */}
      <div className="flex-1 mx-[174px] my-[40px]">
        {/* Header */}
        <div className="">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <Link href='/pages/driver-management'>
              <button className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#A6AFFF] hover:bg-[#97a0f5] transition-colors">
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              </Link>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  {activeTab === 'History' ? 'Detail of Rider History' : 
                   activeTab === 'Reports' ? 'Details of Reports Against the Rider' :
                   activeTab === 'Documents' ? 'Details of Vehicle Documents' : 
                   'Detail of Rider'}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  This section will show every detail of a particular user.
                </p>
              </div>
            </div>
            <button className="px-6 py-2.5 bg-[#BC0E01] hover:bg-[#a00c01] text-white rounded-lg font-medium transition-colors">
              Delete
            </button>
          </div>

          {/* Tabs */}
          <div className='bg-white rounded-lg shadow-sm'>
            <div className="flex">
              <button 
                onClick={() => handleTabChange('Profile')}
                className={`px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'Profile' 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Profile
              </button>
              <button 
                onClick={() => handleTabChange('Documents')}
                className={`px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'Documents' 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Documents
              </button>
              <button 
                onClick={() => handleTabChange('History')}
                className={`px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'History' 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                History
              </button>
              <button 
                onClick={() => handleTabChange('Reports')}
                className={`px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'Reports' 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Reports
              </button>
            </div>

            {/* Tab Content */}
            <div className="px-8 py-4">
              {/* Profile Tab */}
              {activeTab === 'Profile' && (
                <>
                  {/* Profile Header */}
                  <div className="flex items-center gap-8 mb-8">
                    {/* Profile Image */}
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md">
                        <Image
                          src="/profile.svg"
                          alt="John Ken"
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Name and Stats */}
                    <div className="flex-1 items-center justify-center">
                      <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                        Active
                      </span>
                      <h2 className="text-2xl font-semibold text-gray-900 mb-6">John Ken</h2>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-8">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-red-50">
                          <AlertCircle className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                          <div className="text-3xl font-bold text-gray-900">52</div>
                          <div className="text-xs text-gray-500 uppercase tracking-wide">Accused</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-[#FFF4E6]">
                          <Star className="w-6 h-6 text-[#E9A906] fill-[#E9A906]" />
                        </div>
                        <div>
                          <div className="text-3xl font-bold text-gray-900">4.7</div>
                          <div className="text-xs text-gray-500 uppercase tracking-wide">Rating</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Information Grid */}
                  <div className="grid grid-cols-2 gap-x-16 gap-y-6">
                    {/* Email */}
                    <div>
                      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                        Email
                      </label>
                      <div className="flex items-center gap-2 text-gray-900 mb-[12px]">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span>john@gmail.com</span>
                      </div>
                      <hr />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                        Phone
                      </label>
                      <div className="flex items-center gap-2 text-gray-900 mb-[12px]">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>985 659 5955</span>
                      </div>
                      <hr />
                    </div>

                    {/* Joining Date */}
                    <div>
                      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                        Joining Date
                      </label>
                      <div className="flex items-center gap-2 text-gray-900 mb-[12px]">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>Jan 25, 2024</span>
                      </div>
                      <hr />
                    </div>

                    {/* Deletion */}
                    <div>
                      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                        Deletion (30 days timeline)
                      </label>
                      <div className="text-[#BC0E01] font-medium mb-[12px]">
                        20 days left
                      </div>
                      <hr />
                    </div>
                  </div>
                </>
              )}

              {/* Documents Tab */}
              {activeTab === 'Documents' && (
                <>
                  {documentView === null && (
                    <DocumentsTab onViewDocument={handleViewDocument} />
                  )}
                  {documentView === 'license' && (
                    <DriverLicenseView onBack={handleBackToDocuments} />
                  )}
                  {documentView === 'vehicle-info' && (
                    <VehicleInfoView onBack={handleBackToDocuments} />
                  )}
                  {documentView === 'insurance' && (
                    <VehicleInsuranceView onBack={handleBackToDocuments} />
                  )}
                  {documentView === 'registration' && (
                    <VehicleRegistrationView onBack={handleBackToDocuments} />
                  )}
                </>
              )}

              {/* History Tab */}
              {activeTab === 'History' && (
                <div className="grid grid-cols-3 gap-6">
                  {historyData.map((ride) => (
                    <div key={ride.id} className="bg-[#F4F4F6] rounded-lg p-5">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-300">
                          <Image
                            src={ride.image}
                            alt={ride.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{ride.name}</h3>
                          <p className="text-xs text-gray-500">{ride.car}</p>
                        </div>
                        <span className={`text-xs font-medium px-2 py-1 rounded ${
                          ride.status === 'Completed' 
                            ? 'text-green-700 bg-green-100' 
                            : 'text-red-700 bg-red-100'
                        }`}>
                          {ride.status}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mb-4 gap-[20px]">
                        <div className="gap-1 text-gray-700 bg-white px-[38px] py-[6px] rounded-lg">
                          <div className='flex'>
                            <HugeiconsIcon icon={Money04Icon} className='text-[#047049]'/>
                            <span className="font-semibold ml-[10px]">{ride.fare}</span>
                          </div>
                          <div>
                            <span className="text-xs flex justify-center text-center text-gray-500 ml-1">FARE</span>
                          </div>
                        </div>
                        <div className="gap-1 text-gray-700 bg-white px-[38px] py-[6px] rounded-lg">
                          <div className='flex'>
                            <Star className="w-4 h-4 text-[#E9A906] fill-[#E9A906]" />
                            <span className="font-semibold ml-[10px]">{ride.rating}</span>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500 ml-1 text-center">RATING</span>
                          </div>
                        </div>
                      </div>

                      <Link href="/pages/driver-management/dkd/23">
                        <button className="w-full py-2.5 bg-[#A6AFFF] hover:bg-[#97a0f5] text-gray-900 font-medium rounded-lg transition-colors">
                          View
                        </button>
                      </Link>
                    </div>
                  ))}
                </div>
              )}

              {/* Reports Tab */}
              {activeTab === 'Reports' && (
                <div className="space-y-4">
                  {reportsData.map((report) => (
                    <div key={report.id} className="bg-[#F4F4F6] rounded-lg p-5">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-300">
                          <Image
                            src={report.image}
                            alt={report.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{report.name}</h3>
                          <p className="text-sm text-gray-500">{report.role}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed mt-[10px]">
                        {report.comment}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDetails;