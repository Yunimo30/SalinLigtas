const ReportIssues = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-primary flex items-center gap-2 mb-4">
            <i className="fas fa-exclamation-circle"></i> Report an Issue
          </h2>

          {/* Location Selection */}
          <div className="mb-6">
            <label
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              htmlFor="location"
            >
              Location
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                id="location"
                className="form-select block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 focus:border-primary focus:ring-primary"
              >
                <option value="">Select Area</option>
                <option value="taft">Taft Avenue</option>
                <option value="vito-cruz">Vito Cruz</option>
                <option value="pedro-gil">Pedro Gil</option>
                <option value="un-ave">UN Avenue</option>
              </select>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Specific Location Details"
                  className="form-input block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 focus:border-primary focus:ring-primary"
                />
                <button className="absolute right-2 top-2 text-gray-400 hover:text-primary">
                  <i className="fas fa-map-marker-alt"></i>
                </button>
              </div>
            </div>
          </div>

          {/* Issue Type */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Issue Type
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg text-center hover:border-primary hover:text-primary transition-colors">
                <i className="fas fa-water text-2xl mb-2"></i>
                <div className="text-sm">Flooding</div>
              </button>
              <button className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg text-center hover:border-primary hover:text-primary transition-colors">
                <i className="fas fa-road text-2xl mb-2"></i>
                <div className="text-sm">Road Issue</div>
              </button>
              <button className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg text-center hover:border-primary hover:text-primary transition-colors">
                <i className="fas fa-tree text-2xl mb-2"></i>
                <div className="text-sm">Fallen Tree</div>
              </button>
              <button className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg text-center hover:border-primary hover:text-primary transition-colors">
                <i className="fas fa-exclamation-triangle text-2xl mb-2"></i>
                <div className="text-sm">Other</div>
              </button>
            </div>
          </div>

          {/* Severity Level */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Severity Level
            </label>
            <div className="flex gap-4">
              <button className="flex-1 p-3 border border-gray-200 dark:border-gray-600 rounded-lg text-center hover:bg-green-50 dark:hover:bg-green-900/20 hover:border-green-500 hover:text-green-500 transition-colors">
                <i className="fas fa-info-circle mb-1"></i>
                <div className="text-sm">Low</div>
              </button>
              <button className="flex-1 p-3 border border-gray-200 dark:border-gray-600 rounded-lg text-center hover:bg-yellow-50 dark:hover:bg-yellow-900/20 hover:border-yellow-500 hover:text-yellow-500 transition-colors">
                <i className="fas fa-exclamation-circle mb-1"></i>
                <div className="text-sm">Medium</div>
              </button>
              <button className="flex-1 p-3 border border-gray-200 dark:border-gray-600 rounded-lg text-center hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-500 hover:text-red-500 transition-colors">
                <i className="fas fa-exclamation-triangle mb-1"></i>
                <div className="text-sm">High</div>
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              id="description"
              rows="4"
              placeholder="Please provide detailed information about the issue..."
              className="form-textarea block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 focus:border-primary focus:ring-primary"
            ></textarea>
          </div>

          {/* Media Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Upload Media
            </label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
              <div className="mb-4">
                <i className="fas fa-cloud-upload-alt text-4xl text-gray-400"></i>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Drag and drop files here or click to browse
              </p>
              <p className="text-xs text-gray-500">
                Supports: JPG, PNG, MP4 (max 10MB)
              </p>
              <input type="file" className="hidden" multiple accept="image/*,video/*" />
            </div>
          </div>

          {/* Contact Information */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Contact Information (Optional)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Name"
                className="form-input block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 focus:border-primary focus:ring-primary"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                className="form-input block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 focus:border-primary focus:ring-primary"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <button className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              Cancel
            </button>
            <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
              Submit Report
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReportIssues