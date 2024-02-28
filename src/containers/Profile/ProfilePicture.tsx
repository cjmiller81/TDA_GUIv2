import { Box, BoxProps, Button, Typography } from "@mui/material"
import { useFilePicker } from "use-file-picker"
import { FileAmountLimitValidator, FileTypeValidator } from "use-file-picker/validators"
import { ProfileContainer } from "./ProfileContainer"

export const ProfilePicture = ({ ...props }: BoxProps) => {
  const { openFilePicker, filesContent, errors } = useFilePicker({
    readAs: "DataURL",
    accept: "image/*",
    multiple: false,
    validators: [new FileAmountLimitValidator({ max: 1 }), new FileTypeValidator(["jpg", "png"])],
  })

  const imgPath =
    filesContent.length && !errors.length ? filesContent[0].content : "https://mui.com/static/images/avatar/1.jpg"
  return (
    <ProfileContainer
      title="Profile Picture"
      {...props}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
          pl: 3,
          pr: 3,
        }}>
        <img
          width={"80px"}
          height={"80px"}
          style={{ borderRadius: "50%" }}
          alt="Avatar"
          src={imgPath}
        />
        <Typography
          textAlign={"center"}
          variant="body1">
          Upload/Change Your Profile Image
        </Typography>
        <Button
          sx={{ minWidth: "140px" }}
          variant="contained"
          onClick={() => openFilePicker()}>
          Upload Avatar
        </Button>
      </Box>
    </ProfileContainer>
  )
}
