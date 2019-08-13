# Constructing LabelCV Database

## Entities

- Dataset: A logical grouping of images and annotations
- Author: An author can contribute to a dataset or to an annotation
- Image: an visual item to annotate
- Annotation: an annotation made by a human or a system


## Actions on the system (CQRS)


### Public actions

- [C] Add an image to the dataset
- [Q] Get an image from the dataset by ID
- [Q] Get an/the next image to annotate from a dataset
- [C] Add an annotation to an image
    - Add a document in the annotation collection
    - Execute a trigger to update the number of annotation and value on the parent image


### Restricted actions

- [Q] Get images to moderate
- [C] Set image moderation status

## Partitioning 

Ideas for a partition key: 

- dataset
- dataset+1st letter of hash
> Database level RUs ?
- Unique Key Constrain /hash
