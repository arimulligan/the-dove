# the-dove
A Chrome plugin that helps you create peaceful breaks between productive study sessions. Flys down and chats to you. If time permits: when you are resting, you can play simple games with the dove.

#### Specific Performance Benchmarks
Some target numbers and industry best practices I aim to achieve:

1. **Load Time**
   - **Target**: The extension should load within 100-300 milliseconds.
   - **Measurement**: Use Chrome's Developer Tools (Performance tab) to capture the load time.

2. **Memory Usage**
   - **Target**: Keep memory usage below 50 MB for most extensions.
   - **Measurement**: Monitor memory usage with Chrome's Task Manager (Shift + Esc).

3. **Impact on Page Load Time**
   - **Target**: Additional page load time caused by the extension should be less than 100 milliseconds.
   - **Measurement**: Use Lighthouse or WebPageTest to compare page load times with and without the extension enabled.

4. **CPU Usage**
   - **Target**: The extension should use less than 5% of CPU resources on average during idle state and minimal spikes during active use.
   - **Measurement**: Monitor CPU usage using Chrome's Task Manager (Shift + Esc).

5. **Network Requests**
   - **Target**: Minimize the number of network requests, ideally less than 10 requests per page load. Ensure the total size of network requests is under 500 KB.
   - **Measurement**: Use the Network tab in Chrome Developer Tools to analyze requests.

6. **Script Execution Time**
   - **Target**: JavaScript execution time should be under 50 milliseconds per frame.
   - **Measurement**: Use Chrome's Developer Tools (Performance tab) to measure script execution time.

7. **Battery Usage**
   - **Target**: Minimize battery usage impact, aiming for less than a 5% increase in power consumption.
   - **Measurement**: Use battery monitoring tools and Chrome's Task Manager to assess impact.

8. **Error Rates**
   - **Target**: Zero unhandled exceptions or errors logged in the console.
   - **Measurement**: Monitor the console for errors using Chrome Developer Tools -> Console tab.

9. **Responsiveness**
   - **Target**: Ensure user interactions (e.g., clicks, scrolls) respond within 50 milliseconds.
   - **Measurement**: Conduct user testing and use Chrome's Developer Tools (Performance tab) to monitor interaction response times.

10. **Accessibility**
   - **Target**: Achieve a Lighthouse Accessibility score of 90 or above.
   - **Measurement**: Use Lighthouse to run accessibility audits.

