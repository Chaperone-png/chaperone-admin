import { adminAxiosInstance } from "../axiosInstance";

// Create a new blog post
const createBlog = (data: any) => {
  return adminAxiosInstance.post("/blogs/", data);
};

// Update an existing blog post by ID
const updateBlog = (id: string, data: any) => {
  return adminAxiosInstance.put(`/blogs/${id}`, data);
};

// Fetch all blog posts
const getBlogs = (params: any) => {
  return adminAxiosInstance.get("/blogs/", { params });
};

// Fetch a single blog post by ID
const getBlogById = (blogId: string) => {
  return adminAxiosInstance.get(`/blogs/${blogId}/`);
};

// Delete a blog post by ID
const deleteBlog = (blogId: string) => {
  return adminAxiosInstance.delete(`/blogs/${blogId}/`);
};

export const blogApi = {
  createBlog,
  updateBlog,
  getBlogs,
  getBlogById,
  deleteBlog,
};
