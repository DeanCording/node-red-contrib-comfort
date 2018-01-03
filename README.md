# node-red-contrib-comfort
A Node Red node to calculate the thermal comfort level of an environment using ASHRAE Standard 55.


Thermal comfort is the condition of mind that expresses satisfaction with the thermal environment and is assessed by subjective evaluation. Maintaining this standard of thermal comfort for occupants of buildings or other enclosures is one of the important goals of HVAC (heating, ventilation, and air conditioning) design engineers.

The main factors that influence thermal comfort are those that determine heat gain and loss, namely metabolic rate, clothing insulation, air temperature, mean radiant temperature, air speed and relative humidity.  ASHRAE Standard 55 (Thermal Environmental Conditions for Human Occupancy) is a standard that provides minimum requirements for acceptable thermal indoor environments. It establishes the ranges of indoor environmental conditions that are acceptable to achieve thermal comfort for occupants.

This node takes as a minimum the current temperature and humidity readings, and calculates the thermal comfort level for a person in that space wearing a specified amount of clothing and undertaking the specified level of activity.  An optional air speed can be included to account for environments with forced or natural air circulation (drafts). The amount of clothing and level of activity can be adjusted at runtime to account for changes of use at different times of the day ie. sleeping, working, relaxing, exercising.

Comfort level can be calculate either using both the dry bulb temperature and mean radiant temperature, or
with just the operative temperature. As both dry bulb and radiant mean temperatures require special
instruments to measure, and the typical electronic temperature sensor measures close to operative temperature,
most systems will want to use operative temperature.

The calculated thermal comfort level predicts the mean value of the thermal sensation votes (self-reported perceptions) of a large group of persons on a sensation scale expressed from -3 to +3 corresponding to the categories "cold", "cool", "slightly cool", "neutral", "slight warm", "warm", and "hot".  Based on the calculated thermal comfort level, heating or cooling systems could be controlled to produce the most comfortable environmental conditions. Alternatively, you could just use the output of the node to tell you if you need to wear a jumper or not.



