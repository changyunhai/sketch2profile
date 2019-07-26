# sketch2profile
####Make profiles from your 2d sketch.

the project is used for generating the area from the sketch.

Now the sketch curve only supports `line` and `arc`. 
Bezier curve may be added further.


the main algorithm is to calculate the intersection of curves ,
break the `LINE` and `ARC` and build the profile.


This is the kernel algorithm for drawing walls and generate room.
Besides that, it is the basis of swept and extrusion for 3D tools.


#### Note: History

2019年7月20日：本项目进行了大幅改进，包括性能优化，添加吸附功能，进行压缩编译，bug fix等，
并依据需求将此项目转为私有，从而便于进行交付。
