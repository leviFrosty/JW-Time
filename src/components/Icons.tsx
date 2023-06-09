import { Icon } from "@ui-kitten/components";
import React from "react";
import { ImageProps } from "react-native";

export const ExportIcon = (
  props?: Partial<ImageProps>,
): React.ReactElement<ImageProps> => <Icon {...props} name="export-variant" />;
export const ChevronRight = (
  props?: Partial<ImageProps>,
): React.ReactElement<ImageProps> => <Icon {...props} name="chevron-right" />;
export const ChevronLeft = (
  props?: Partial<ImageProps>,
): React.ReactElement<ImageProps> => <Icon {...props} name="chevron-left" />;
export const PlusIcon = (
  props?: Partial<ImageProps>,
): React.ReactElement<ImageProps> => <Icon {...props} name="plus" />;
export const DotsIcon = (
  props?: Partial<ImageProps>,
): React.ReactElement<ImageProps> => <Icon {...props} name="dots-horizontal" />;
export const DeleteIcon = (
  props?: Partial<ImageProps>,
): React.ReactElement<ImageProps> => <Icon {...props} name={"delete"} />;
export const PublisherTypeIcon = (
  props?: Partial<ImageProps>,
): React.ReactElement<ImageProps> => <Icon {...props} name={"badge-account"} />;
export const TargetIcon = (
  props?: Partial<ImageProps>,
): React.ReactElement<ImageProps> => (
  <Icon {...props} name={"bullseye-arrow"} />
);
export const SortAscCalendarIcon = (
  props?: Partial<ImageProps>,
): React.ReactElement<ImageProps> => (
  <Icon {...props} name={"sort-calendar-ascending"} />
);
export const SortDescCalendarIcon = (
  props?: Partial<ImageProps>,
): React.ReactElement<ImageProps> => (
  <Icon {...props} name={"sort-calendar-descending"} />
);
