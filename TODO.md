# Enhanced Flood Height Calculation Model - Implementation Plan

## Completed Tasks
- [x] Analyze current model and plan enhancements
- [x] Get user approval for plan
- [x] Update data.js: Add soilSaturation property to each street (e.g., Manila: 1.3, others: 1.0)
- [x] Update index.html: Add weather mode selector dropdown in controls panel
- [x] Update script.js: Modify expectedFloodHeightCm to include soilSaturation multiplier
- [x] Update script.js: Add mock intensity function (sinusoidal variation based on time)
- [x] Update script.js: Add real-time intensity function (fetch from API with mock fallback)
- [x] Update script.js: Integrate weather mode logic into runSimulation and UI
- [x] Test implementation: Run simulation with different modes and campuses
- [x] Verify no breaking changes and realistic flood heights

## Report Issues Page Implementation

## Completed Tasks
- [x] Add comprehensive CSS styles for report issues page
- [x] Add mobile responsiveness for report issues page
- [x] Remove "coming soon" overlays from photo upload and community alerts sections
- [x] Test the report issues page functionality

## Pending Tasks
- [ ] Implement JavaScript functionality for report form submission
- [ ] Add photo upload functionality with preview
- [ ] Implement incident map with location selection
- [ ] Add report status tracking functionality
- [ ] Implement community alerts real-time updates

## Theme Toggle Implementation

## Completed Tasks
- [x] Add theme toggle button and dropdown menu to header in index.html
- [x] Add comprehensive CSS styles for theme toggle components
- [x] Implement JavaScript functionality for theme switching (light, dark, system)
- [x] Add localStorage persistence for theme preference
- [x] Add system theme detection and automatic switching
- [x] Test theme toggle functionality across different sections

## Plan & Monitor Guidelines Enhancement

## Completed Tasks
- [x] Add help icons (?) to Duration, Weather Mode, and Rainfall Pattern inputs
- [x] Create comprehensive modal dialogs for each input field with detailed explanations
- [x] Add JavaScript event handlers for opening/closing the new guideline modals
- [x] Update modal close handlers to include new modals
- [x] Test the new help functionality

## Enhanced Flood Model - Multi-Factor Implementation

## Completed Tasks
- [x] Add drainageCapacity property to each street (0.6-1.0 scale, lower = poorer drainage)
- [x] Add elevation property to each street (5-15 meters above sea level)
- [x] Update expectedFloodHeightCm function to incorporate drainage capacity and elevation factors
- [x] Implement enhanced flood calculation with 6 factors: rainfall, duration, sensitivity, soil saturation, drainage, and elevation
- [x] Test enhanced model with different scenarios
