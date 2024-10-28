import React, { useState } from 'react';
import { Tabs, Form, Input, Select, Upload, Button, Typography, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import '../styles/WebsiteContentManagement.scss';

const { Option } = Select;
const { Title } = Typography;
const { TabPane } = Tabs;

type ContentType = 'sliding-banner' | 'listing' | 'collections' | 'deal';
type ListingType = 'plants' | 'nurseries' | 'tools';

const WebsiteContentManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('home');
    const [contentType, setContentType] = useState<ContentType | '' | any>('');
  const [listingTitle, setListingTitle] = useState<string>('');
  const [listingType, setListingType] = useState<ListingType | ''| any>('');
  const [viewAllUrl, setViewAllUrl] = useState<string>('');
  const [files, setFiles] = useState<File[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isAddingSection, setIsAddingSection] = useState<boolean>(false);

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  const handleContentTypeChange = (value: ContentType) => {
    setContentType(value);
  };

  const handleListingTypeChange = (value: ListingType) => {
    setListingType(value);
  };

  const handleUploadChange = (info: any) => {
    if (info.fileList.length > 10) {
      message.error('You can upload a maximum of 10 images.');
    } else {
      setFiles(info.fileList.map((file: any) => file.originFileObj));
    }
  };

  const handleSubmit = () => {
    // Handle form submission
    console.log({
      contentType,
      listingTitle,
      listingType,
      viewAllUrl,
      files,
      selectedItems,
    });
  };

  return (
    <div className="website-content-management">
      <Title level={1}>Website Content Management</Title>
      
      {isAddingSection ? (
        <div className="form-container">
          <Button 
            type="default" 
            className="toggle-button" 
            onClick={() => setIsAddingSection(false)}
          >
            View Sections
          </Button>
          <Form layout="vertical">
            <Form.Item label="Content Type">
              <Select value={contentType} onChange={handleContentTypeChange}>
                <Option value="sliding-banner">Sliding Banner</Option>
                <Option value="listing">Listing</Option>
                <Option value="collections">Collections</Option>
                <Option value="deal">Deal</Option>
              </Select>
            </Form.Item>

            {contentType === 'sliding-banner' && (
              <Form.Item label="Add Images (3 to 10)">
                <Upload
                  multiple
                  showUploadList={false}
                  beforeUpload={() => false}
                  onChange={handleUploadChange}
                >
                  <Button icon={<UploadOutlined />}>Upload Images</Button>
                </Upload>
                <div className="image-previews">
                  {files.map((file, index) => (
                    <img
                      key={index}
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index}`}
                      width="100"
                      className="image-preview"
                    />
                  ))}
                </div>
              </Form.Item>
            )}

            {contentType === 'listing' && (
              <>
                <Form.Item label="Listing Title">
                  <Input value={listingTitle} onChange={(e) => setListingTitle(e.target.value)} />
                </Form.Item>

                <Form.Item label="Listing Type">
                  <Select value={listingType} onChange={handleListingTypeChange}>
                    <Option value="plants">Plants</Option>
                    <Option value="nurseries">Nurseries</Option>
                    <Option value="tools">Tools</Option>
                  </Select>
                </Form.Item>

                <Form.Item label="View All URL">
                  <Input value={viewAllUrl} onChange={(e) => setViewAllUrl(e.target.value)} />
                </Form.Item>

                {listingType && (
                  <Form.Item label={`Select ${listingType}`}>
                    <Select
                      mode="multiple"
                      value={selectedItems}
                      onChange={(value) => setSelectedItems(value as string[])}
                    >
                      {/* Options should be dynamically generated based on the listing type */}
                      <Option value="item1">Item 1</Option>
                      <Option value="item2">Item 2</Option>
                      {/* Add more options */}
                    </Select>
                  </Form.Item>
                )}
              </>
            )}

            <Form.Item>
              <Button type="primary" onClick={handleSubmit}>Submit</Button>
            </Form.Item>
          </Form>
        </div>
      ) : (
        <div className="sections-listing">
          <Tabs defaultActiveKey="home" onChange={handleTabChange} className="tabs">
            <TabPane tab="Home" key="home">
              {/* Render the section listing here */}
              <div className="section-content">
                <p>Section listing content here...</p>
              </div>
            </TabPane>

            {/* Add additional tabs as needed */}
          </Tabs>
          <Button 
            type="primary" 
            className="toggle-button" 
            onClick={() => setIsAddingSection(true)}
          >
            Add Section
          </Button>
        </div>
      )}
    </div>
  );
};

export default WebsiteContentManagement;
