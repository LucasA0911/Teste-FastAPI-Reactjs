import axios from "axios";
import { useState, useEffect } from "react";
import {
  Flex,
  Box,
  Center,
  FormControl,
  Input,
  FormLabel,
  HStack,
  Button,
  List,
  ListItem,
  Text,
  Stack
} from "@chakra-ui/react";

function App() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editUsername, setEditUsername] = useState('');
  const [editEmail, setEditEmail] = useState('');

  // Substitua pelo URL real do seu backend
  const API_URL = "https://your-backend-domain.com";

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/users/`);
      setUsers(response.data.users);
    } catch (error) {
      setMessage('Error fetching users');
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/users/`, {
        username,
        email,
        password
      });
      setMessage(`User registered successfully with ID: ${response.data.id}`);
      fetchUsers(); // Refresh user list
    } catch (error) {
      setMessage('Error registering user');
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/users/${editingUserId}`, {
        username: editUsername,
        email: editEmail,
        password // Optionally include password if needed
      });
      setMessage('User updated successfully');
      setEditingUserId(null);
      fetchUsers(); // Refresh user list
    } catch (error) {
      setMessage('Error updating user');
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`${API_URL}/users/${userId}`);
      setMessage('User deleted successfully');
      fetchUsers(); // Refresh user list
    } catch (error) {
      setMessage('Error deleting user');
    }
  };

  return (
    <Box h="100vh">
      <Center
        as="header"
        h={150}
        bg="teal.500"
        color="white"
        fontWeight="bold"
        fontSize="4xl"
        pb="8"
      >
        Formulário
      </Center>
      <Flex
        align="center"
        justify="center"
        bg="blackAlpha.200"
        h="calc(100vh - 150px)"
        p="4"
      >
        <Stack spacing="8" w="100%" maxW={1200}>
          {/* Create User Form */}
          <Box bg="white" borderRadius={5} p="6" boxShadow="0 1px 2px #ccc">
            <FormControl as="form" display="flex" flexDir="column" gap="4" onSubmit={handleCreateUser}>
              <HStack spacing="4">
                <Box w="100%">
                  <FormLabel htmlFor="nome">Nome Completo</FormLabel>
                  <Input
                    id="nome"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </Box>
                <Box w="100%">
                  <FormLabel htmlFor="email">E-mail</FormLabel>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Box>
                <Box w="100%">
                  <FormLabel htmlFor="password">Senha</FormLabel>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Box>
              </HStack>
              <HStack justify="center">
                <Button
                  w={240}
                  p="6"
                  type="submit"
                  bg="teal.600"
                  color="white"
                  fontWeight="bold"
                  fontSize="xl"
                  mt="2"
                  _hover={{ bg: "teal.800" }}
                >
                  Criar
                </Button>
              </HStack>
            </FormControl>
          </Box>

          {/* Update User Form */}
          {editingUserId && (
            <Box bg="white" borderRadius={5} p="6" boxShadow="0 1px 2px #ccc">
              <FormControl as="form" display="flex" flexDir="column" gap="4" onSubmit={handleUpdateUser}>
                <HStack spacing="4">
                  <Box w="100%">
                    <FormLabel htmlFor="edit-nome">Nome Completo</FormLabel>
                    <Input
                      id="edit-nome"
                      value={editUsername}
                      onChange={(e) => setEditUsername(e.target.value)}
                      required
                    />
                  </Box>
                  <Box w="100%">
                    <FormLabel htmlFor="edit-email">E-mail</FormLabel>
                    <Input
                      id="edit-email"
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      required
                    />
                  </Box>
                </HStack>
                <HStack justify="center">
                  <Button
                    w={240}
                    p="6"
                    type="submit"
                    bg="teal.600"
                    color="white"
                    fontWeight="bold"
                    fontSize="xl"
                    mt="2"
                    _hover={{ bg: "teal.800" }}
                  >
                    Atualizar
                  </Button>
                  <Button
                    w={240}
                    p="6"
                    bg="red.600"
                    color="white"
                    fontWeight="bold"
                    fontSize="xl"
                    mt="2"
                    _hover={{ bg: "red.800" }}
                    onClick={() => setEditingUserId(null)}
                  >
                    Cancelar
                  </Button>
                </HStack>
              </FormControl>
            </Box>
          )}

          {/* User List */}
          <Box bg="white" borderRadius={5} p="6" boxShadow="0 1px 2px #ccc">
            <Text fontSize="xl" mb="4">Lista de Usuários</Text>
            <List spacing={3}>
              {users.map((user) => (
                <ListItem key={user.id} p="4" borderBottom="1px" borderColor="gray.200">
                  <Stack spacing="2">
                    <Text fontWeight="bold">Nome: {user.username}</Text>
                    <Text>E-mail: {user.email}</Text>
                    <HStack spacing="4">
                      <Button
                        colorScheme="blue"
                        onClick={() => {
                          setEditingUserId(user.id);
                          setEditUsername(user.username);
                          setEditEmail(user.email);
                        }}
                      >
                        Editar
                      </Button>
                      <Button
                        colorScheme="red"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        Excluir
                      </Button>
                    </HStack>
                  </Stack>
                </ListItem>
              ))}
            </List>
          </Box>

          {message && <Text color="red.500">{message}</Text>}
        </Stack>
      </Flex>
    </Box>
  );
}

export default App;