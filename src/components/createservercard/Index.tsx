import React from "react";

import * as yup from "yup";

import {
  CreateServerPopUpContainer,
  CreateServerPopUpAction,
  CreateServerPopUpActionName,
  CreateServerPopUpActionImage,
  CreateServerPopUpBackground,
  CreateServerPopUpActionDescription,
  CreateServerPopUpBackgroundContainer,
  CreateServerPopUpActionButton,
  OptionLabel,
  CreateServerPopUpInnerContainer,
  CreateServerLabelAndInputContainer,
  CreateServerInputContainer,
  CreateServerPopUpInnerContainerName,
  CreateServerInput,
  ImageInputButton,
  OptionIcon
} from "./Styles";

import ServerRegionImage from "../../assets/server-region.png";

import CreateServerActionIcon from "../../assets/create-server.svg";
import JoinServerActionIcon from "../../assets/join-server.png";

import CreateServerPopUpLeftBackground from "../../assets/left-background.png";
import CreateServerPopUpRightBackground from "../../assets/right-background.png";
import { ErrorMessage } from "../../pages/register/Styles";

import api from "../../services/Api";
import { CreateServer as CreateServerMutation } from "../../graphql/mutations/CreateServer";
import { store } from "../../store/Index";
import { JoinServer as JoinServerMutation } from "../../graphql/mutations/JoinServer";

enum ECards {
  MAIN = 0,
  CREATE,
  JOIN
}

interface IState {
  currentServerCard: any;
  cards: any;
  inviteLink: any;
  serverName: any;
  invalidInviteLink: any;
  invalidServerName: any;
  serverNameAlreadyInUse: any;
}

export default class CreateServerCard extends React.Component<any, IState> {
  constructor(props: any) {
    super(props);

    this.state = {
      currentServerCard: ECards.MAIN,
      cards: new Map<number, any>(),
      inviteLink: "",
      serverName: "",
      invalidInviteLink: false,
      invalidServerName: false,
      serverNameAlreadyInUse: false
    };

    this.state.cards.set(
      ECards.MAIN,
      <CreateServerPopUpContainer>
        <CreateServerPopUpActionButton
          style={{ width: "20%", marginLeft: "80%" }}
          color={"#E2E3E7"}
          onClick={() => this.props.setOnView(false)}
        >
          Close
        </CreateServerPopUpActionButton>
        <CreateServerPopUpBackgroundContainer>
          <CreateServerPopUpBackground src={CreateServerPopUpLeftBackground} />
          <CreateServerPopUpBackground src={CreateServerPopUpRightBackground} />
          <CreateServerPopUpAction>
            <CreateServerPopUpActionName color={"#7289DA"}>
              Create
            </CreateServerPopUpActionName>
            <CreateServerPopUpActionDescription>
              Create a new server and invite your friends. It's free!
            </CreateServerPopUpActionDescription>
            <CreateServerPopUpActionImage src={CreateServerActionIcon} />
            <CreateServerPopUpActionButton
              color={"#7289DA"}
              onClick={async (): Promise<void> =>
                await this.setState({ currentServerCard: ECards.CREATE })
              }
            >
              Create a server
            </CreateServerPopUpActionButton>
          </CreateServerPopUpAction>

          <CreateServerPopUpAction style={{ left: "60%" }}>
            <CreateServerPopUpActionName color={"#3CA374"}>
              Join
            </CreateServerPopUpActionName>
            <CreateServerPopUpActionDescription>
              Enter an instant invite and join your friend's server.
            </CreateServerPopUpActionDescription>
            <CreateServerPopUpActionImage
              src={JoinServerActionIcon}
              style={{ marginTop: "30px", marginBottom: "30px" }}
            />
            <CreateServerPopUpActionButton
              color={"#3CA374"}
              onClick={async (): Promise<void> =>
                await this.setState({ currentServerCard: ECards.JOIN })
              }
            >
              Join a server
            </CreateServerPopUpActionButton>
          </CreateServerPopUpAction>
        </CreateServerPopUpBackgroundContainer>
      </CreateServerPopUpContainer>
    );

    this.state.cards.set(
      ECards.CREATE,
      <CreateServerPopUpContainer>
        <CreateServerPopUpInnerContainer>
          <CreateServerPopUpInnerContainerName>
            CREATE YOUR SERVER
          </CreateServerPopUpInnerContainerName>
          <CreateServerPopUpActionDescription
            style={{ fontWeight: "bolder", fontSize: "14px" }}
          >
            By creating a server, you will have access to voice and text chat to
            use amongst your friends.
          </CreateServerPopUpActionDescription>
          <CreateServerInputContainer>
            <CreateServerLabelAndInputContainer>
              <OptionLabel
                style={{
                  color: "87909C",
                  marginLeft: "-77%"
                }}
              >
                SERVER NAME
              </OptionLabel>
              <CreateServerInput
                placeholder="Enter a server name"
                onChange={async (e): Promise<void> =>
                  await this.setState({ serverName: e.target.value })
                }
              />
              {this.state.invalidServerName && (
                <ErrorMessage style={{ marginTop: "12%", marginLeft: "-29%" }}>
                  Server name must be valid
                </ErrorMessage>
              )}
              {this.state.serverNameAlreadyInUse && (
                <ErrorMessage style={{ marginTop: "12%", marginLeft: "-29%" }}>
                  Server name is already in use
                </ErrorMessage>
              )}
            </CreateServerLabelAndInputContainer>
            <ImageInputButton>
              Change <br />
              Icon
            </ImageInputButton>
          </CreateServerInputContainer>
          <CreateServerLabelAndInputContainer
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <OptionIcon
              src={ServerRegionImage}
              style={{
                width: "280px",
                height: "auto",
                filter: "none",
                marginLeft: "-10%"
              }}
            />
            <CreateServerPopUpActionButton
              color={"#677BC4"}
              style={{ width: "100px", color: "#fff" }}
              onClick={this.createServer}
            >
              Create
            </CreateServerPopUpActionButton>
            <CreateServerPopUpActionButton
              color={"#99AAB5"}
              style={{ marginLeft: "20px", width: "100px", color: "#fff" }}
              onClick={async (): Promise<void> =>
                await this.setState({ currentServerCard: ECards.MAIN })
              }
            >
              Back
            </CreateServerPopUpActionButton>
          </CreateServerLabelAndInputContainer>
        </CreateServerPopUpInnerContainer>
      </CreateServerPopUpContainer>
    );

    this.state.cards.set(
      ECards.JOIN,
      <CreateServerPopUpContainer>
        <CreateServerPopUpInnerContainer>
          <CreateServerPopUpInnerContainerName style={{ color: "#53BB8C" }}>
            JOIN A SERVER
          </CreateServerPopUpInnerContainerName>
          <CreateServerPopUpActionDescription
            style={{ fontWeight: "bolder", fontSize: "14px" }}
          >
            Enter an instant invite below to join an existing server. The invite
            will look something like these:
          </CreateServerPopUpActionDescription>
          <OptionLabel style={{ fontSize: "11px", color: "#8C9EE0" }}>
            https://discord.gg/qJq5C
          </OptionLabel>
          <OptionLabel style={{ fontSize: "11px", color: "#8C9EE0" }}>
            https://discord.gg/discord-developers-qJq5C
          </OptionLabel>
          <CreateServerInputContainer>
            <CreateServerLabelAndInputContainer
              style={{ width: "80%", marginLeft: "10%" }}
            >
              <OptionLabel
                style={{
                  color: "87909C",
                  marginLeft: "-77%"
                }}
              />
              <CreateServerInput
                placeholder="Enter instant invite"
                onChange={async (e): Promise<void> =>
                  await this.setState({ inviteLink: e.target.value })
                }
              />
              {this.state.invalidInviteLink && (
                <ErrorMessage style={{ marginTop: "9%", marginLeft: "-24%" }}>
                  Invite link must be valid
                </ErrorMessage>
              )}
            </CreateServerLabelAndInputContainer>
          </CreateServerInputContainer>
          <CreateServerLabelAndInputContainer
            style={{
              marginTop: "20%",
              flexDirection: "row",
              justifyContent: "space-around",
              width: "100%"
            }}
          >
            <CreateServerPopUpActionButton
              color={"#99AAB5"}
              style={{
                marginLeft: "20px",
                marginRight: "50%",
                width: "100px",
                color: "#fff"
              }}
              onClick={async (): Promise<void> =>
                await this.setState({ currentServerCard: ECards.MAIN })
              }
            >
              Back
            </CreateServerPopUpActionButton>
            <CreateServerPopUpActionButton
              color={"#43B581"}
              style={{ marginLeft: "20px", width: "100px", color: "#fff" }}
              onClick={this.joinServer}
            >
              Join
            </CreateServerPopUpActionButton>
          </CreateServerLabelAndInputContainer>
        </CreateServerPopUpInnerContainer>
      </CreateServerPopUpContainer>
    );
  }

  async validate(field: string): Promise<any> {
    const schema = yup.object().shape({
      field: yup
        .string()
        .min(5, "must be at least 5 characters long")
        .max(255)
    });

    return await schema.validate({ field }, { abortEarly: false });
  }

  createServer = async () => {
    try {
      const {
        data: {
          data: { create_server }
        }
      }: any = await api.post("", CreateServerMutation(this.state.serverName));

      switch (create_server.status) {
        case 201:
          const { user }: any = store.getState();

          user.servers.push(create_server.server);

          store.dispatch({
            type: "SET_USER",
            user,
            token: user.token
          });

          break;
        case 400:
          await this.setState({
            invalidServerName: false,
            invalidInviteLink: false,
            serverNameAlreadyInUse: true
          });
          break;
        default:
          console.error("Something went wrong", create_server);
          break;
      }
    } catch (error) {
      console.error(error);
    }
  };

  joinServer = async (): Promise<void> => {
    if (!this.state.inviteLink) return;

    try {
      const {
        data: {
          data: { join_server }
        }
      }: any = await api.post("", JoinServerMutation(this.state.inviteLink));

      switch (join_server.status) {
        case 201:
          const { user }: any = store.getState();

          user.servers.push(join_server.server);

          store.dispatch({
            type: "SET_USER",
            user,
            token: user.token
          });

          break;
        case 400:
          await this.setState({
            invalidServerName: false,
            invalidInviteLink: true
          });
          break;
        default:
          console.error("something went wrong", join_server);
      }
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    return this.state.cards.get(this.state.currentServerCard);
  }
}
