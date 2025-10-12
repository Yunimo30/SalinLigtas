# TODO: Campus Flood Simulator Enhancements

## Completed Tasks
- [x] Add suspension banner above map (50px height, green/red based on >30% impassable threshold)
- [x] Update banner text: "Classes On Track" (green) vs "CLASS SUSPENSION RECOMMENDED" (red)
- [x] Adjust map height to accommodate banner (calc(72vh - 50px))
- [x] Update script.js to control banner dynamically
- [x] Add ~5 new streets to UP Diliman: Diliman Ave, Quirino Ave, Infanta St, Masangkay St, PhilCOA Ave
- [x] Extend existing streets (C.P. Garcia Ave, Katipunan Ave, Commonwealth Ave) for better coverage
- [x] Assign realistic sensitivities (1.0-1.3) to new streets
- [x] Add Tutorial Modal with step-by-step guide (3 steps: select campus, enter intensity, run simulation)
- [x] Add Rainfall Guidelines Modal with intensity categories (Light: 5-10 mm/hr, Moderate: 15-30 mm/hr, Heavy: 40-60+ mm/hr)
- [x] Add "How to Use" button in unit toggle section
- [x] Add help icon (?) next to rainfall intensity input
- [x] Implement tutorial navigation with Next/Previous/Done buttons
- [x] Add modal closing functionality (close button and click outside)
- [x] Update CSS for unit toggle (flex layout), help icon styling, and tutorial modal styles

## Remaining Tasks
- [ ] Test the suspension banner with different scenarios
- [ ] Verify new streets appear correctly on map
- [ ] Ensure banner updates in real-time during simulations
- [ ] Test with forecast mode
- [ ] Test tutorial modal navigation and functionality
- [ ] Test rainfall guidelines modal
- [ ] Verify help icon and "How to Use" button work correctly
- [ ] Test modal closing behaviors

## Notes
- Banner uses existing threshold logic (>30% impassable streets)
- New streets added to data.js for UP Diliman campus
- Banner positioned above map, map height adjusted accordingly
- Text is all caps for "CLASS SUSPENSION RECOMMENDED" to emphasize urgency
