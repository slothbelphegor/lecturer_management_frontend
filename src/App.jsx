import { Routes, Route, useLocation } from 'react-router-dom'
import React, { useState, useEffect } from 'react';

import './App.css'
import Home from './pages/Home'

import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoutes'
import AllowedRoute from './components/AllowedRoutes'
import { RoleProvider } from './components/RoleContext';

import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import PasswordResetRequest from './pages/auth/PasswordResetRequest'
import PasswordReset from './pages/auth/PasswordReset'

import CreateLecturer from './pages/lecturers/Create'
import EditLecturer from './pages/lecturers/Edit'
import DeleteLecturer from './pages/lecturers/Delete'
import ListLecturer from './pages/lecturers/List'

import ListSubject from './pages/subjects/List'
import CreateSubject from './pages/subjects/Create'
import EditSubject from './pages/subjects/Edit'
import DeleteSubject from './pages/subjects/Delete'
import ListDocument from './pages/documents/List'
import CreateDocument from './pages/documents/Create'
import DeleteDocument from './pages/documents/Delete'
import EditDocument from './pages/documents/Edit'
import ListEvaluation from './pages/evaluations/List'
import CreateEvaluation from './pages/evaluations/Create'
import EditEvaluation from './pages/evaluations/Edit'
import DeleteEvaluation from './pages/evaluations/Delete'
import ListSchedule from './pages/schedules/List'
import ScheduleDetails from './pages/schedules/Details'
import MyInfo from './pages/lecturers/MyInfo'
import MyEvaluations from './pages/evaluations/MyEvaluations'
import MySchedules from './pages/schedules/MySchedules'
import MyAccount from './pages/auth/MyAccount'
import ListUser from './pages/users/List'
import EditUser from './pages/users/Edit'
import DeleteUser from './pages/users/Delete'
import CreateUser from './pages/users/Create'
import CheckLecturer from './pages/lecturers/Check'
import ListPotentialLecturer from './pages/lecturers/ListPotentialLecturers'
import ListRecommendation from './pages/recommendations/List';
import MyRecommendations from './pages/recommendations/MyRecommendations';
import EditRecommendation from './pages/recommendations/Edit';
import DeleteRecommendation from './pages/recommendations/Delete';
import CreateRecommendation from './pages/recommendations/Create';


function App() {
  const location = useLocation()
  const noNavbar = location.pathname === '/register' || location.pathname === "/login" || location.pathname.includes("password") 
  
  
  return (
    // <RoleProvider >
      
        noNavbar ?
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/request/password_reset" element={<PasswordResetRequest />} />
            <Route path="/password_reset/:token" element={<PasswordReset />} />
          </Routes>
          :
          <Navbar
            content={
              <Routes>
                <Route element={<ProtectedRoute/>}>
                  <Route path="/" element={<Home />} />
                  <Route path="/lecturers" element={<ListLecturer />}/>
                  <Route element={<AllowedRoute allowedRoles={['education_department']}/>}>
                    <Route path="/lecturers/create" element={<CreateLecturer />}/>
                    
                    <Route path="/lecturers/delete/:id" element={<DeleteLecturer />}/>
                  </Route>
                  <Route element={<AllowedRoute allowedRoles={['it_faculty', 'education_department']}/>}>
                    <Route path="/lecturers/check/:id" element={<CheckLecturer />}/>
                    <Route path="/potential_lecturers" element={<ListPotentialLecturer />} />
                  </Route>
                  <Route path="/lecturers/:id/evaluations" element={<ListEvaluation />}/>
                  <Route element={<AllowedRoute allowedRoles={['it_faculty', 'supervision_department']}/>}>
                    <Route path="/lecturers/:id/evaluations/create" element={<CreateEvaluation />}/>
                    <Route path="/lecturers/:id/evaluations/edit/:id" element={<EditEvaluation />}/>
                    <Route path="/lecturers/:id/evaluations/delete/:id" element={<DeleteEvaluation />}/>
                  </Route>
                  <Route path="/lecturers/:id/schedules" element={<ListSchedule />}/>
                  <Route path="/lecturers/:id/schedules/:id" element={<ScheduleDetails />}/>
                  <Route path="/potential_lecturers" element={<ListPotentialLecturer />} />
                  <Route path="/subjects" element={<ListSubject/>}></Route>
                  <Route element={<AllowedRoute allowedRoles={['education_department', 'it_faculty']}/>}>
                    <Route path="/lecturers/edit/:id" element={<EditLecturer />}/>  
                    <Route path="/subjects/create" element={<CreateSubject/>}></Route>
                    <Route path="/subjects/edit/:id" element={<EditSubject />}/>
                    <Route path="/subjects/delete/:id" element={<DeleteSubject />}/>
                    <Route path="/documents/create" element={<CreateDocument/>}></Route>
                    <Route path="/documents/delete/:id" element={<DeleteDocument />}/>
                    <Route path="/documents/edit/:id" element={<EditDocument />}/>
                    <Route path="/documents/edit/:id" element={<EditDocument />}/>
                    <Route path="/recommendations" element={<ListRecommendation/>}></Route>
                    <Route path="/recommendations/edit/:id" element={<EditRecommendation/>}></Route>
                    <Route path="/recommendations/delete/:id" element={<DeleteRecommendation/>}></Route>
                  </Route> 
                  <Route path="/documents" element={<ListDocument/>}></Route>
                  <Route element={<AllowedRoute allowedRoles={['education_department']}/>}>
                    <Route path="/users" element={<ListUser />}/>
                    <Route path="/users/create" element={<CreateUser />}/>
                    <Route path="/users/edit/:id" element={<EditUser />}/>
                    <Route path="/users/delete/:id" element={<DeleteUser />}/>
                  </Route>
                  <Route element={<AllowedRoute allowedRoles={['lecturer', 'potential_lecturer']}/>}>
                    <Route path="/my_info" element={<MyInfo />}/>
                    <Route path="/my_evaluations" element={<MyEvaluations/>}/>
                    <Route path="/my_schedules" element={<MySchedules/>}/>
                    <Route path="/my_recommendations" element={<MyRecommendations/>}/>
                    <Route path="/my_recommendations/create" element={<CreateRecommendation/>}/>
                    <Route path="/my_recommendations/edit/:id" element={<EditRecommendation/>}/>
                    <Route path="/my_recommendations/delete/:id" element={<DeleteRecommendation/>}/>
                  </Route>  
                  <Route path="/my_account" element={<MyAccount/>}/>
                </Route>
              </Routes>
            }
          />
      
    // </RoleProvider>
  )
}

export default App
