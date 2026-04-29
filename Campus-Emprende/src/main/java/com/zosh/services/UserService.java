package com.zosh.services;


import com.zosh.domain.UserRole;
import com.zosh.exception.UserException;
import com.zosh.modal.User;
import com.zosh.payload.response.TopStudentResponse;

import java.util.List;
import java.util.Set;

public interface UserService {
	User getUserByEmail(String email) throws UserException;
	User getUserFromJwtToken(String jwt) throws UserException;
	User getUserById(Long id) throws UserException;
	Set<User> getUserByRole(UserRole role) throws UserException;
	List<User> getUsers() throws UserException;
	User getCurrentUser() throws UserException;



	/**
	 * Get total count of all registered users (Admin only)
	 */
	long getTotalUserCount();

	List<TopStudentResponse> getTopStudents();
}
