import React, { useEffect, useState } from 'react';
import { Table, Accordion, Card, Breadcrumb } from 'react-bootstrap';
import stockManagementApis from '../apis/StockManagementApis';
import Main from '../layout/Main';
import { Link } from 'react-router-dom';

const Permissions = () => {
    const [modules, setModules] = useState([]);
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [selectedRole, setSelectedRole] = useState(null);

    useEffect(() => {
        const fetchModules = async () => {
            try {
                const result = await stockManagementApis.getModule();
                setModules(Array.isArray(result) ? result : []);
                console.log('Modules fetched:', result);
            } catch (error) {
                console.error('Error fetching modules:', error);
                setModules([]);
            }
        };

        const fetchRoles = async () => {
            try {
                const result = await stockManagementApis.getRoles();
                setRoles(Array.isArray(result) ? result : []);
                console.log('Roles fetched:', result);
            } catch (error) {
                console.error('Error fetching roles:', error);
                setRoles([]);
            }
        };

        fetchModules();
        fetchRoles();
    }, []);

    useEffect(() => {
        const fetchPermissions = async () => {
            if (selectedRole) {
                try {
                    const result = await stockManagementApis.getPermissionById(selectedRole);
                    console.log('Permissions fetched:', result);
                    setPermissions(Array.isArray(result) ? result : []);
                } catch (error) {
                    console.error('Error fetching permissions:', error);
                    setPermissions([]);
                }
            }
        };

        fetchPermissions();
    }, [selectedRole]);

    const handleRoleSelect = (roleId) => {
        console.log('Role selected:', roleId);
        setSelectedRole(roleId);
    };

    const handlePermissionChange = (moduleId, permissionType) => {
        setPermissions((prevPermissions) => {
            const existingPermission = prevPermissions.find(p => p.module_id === moduleId && p.role_id === selectedRole);
            if (existingPermission) {
                return prevPermissions.map(p =>
                    p.module_id === moduleId && p.role_id === selectedRole
                        ? { ...p, [permissionType]: !p[permissionType] }
                        : p
                );
            } else {
                return [
                    ...prevPermissions,
                    { module_id: moduleId, role_id: selectedRole, [permissionType]: true }
                ];
            }
        });
    };

    const handleSave = async () => {
        try {
            for (const permission of permissions) {
                if (permission.id) {
                    console.log(`Permission updated for id: ${permission.id}`, permission);
                    await stockManagementApis.updatePermission(permission.id, permission);
                    // alert('update permission successfully.');
                }
                else {
                    console.log(`Permission created for module_id: ${permission.module_id}`, permission);
                    await stockManagementApis.createPermission(permission);
                    // alert('Permissions saved successfully.');
                }
            }
        } catch (error) {
            console.error('Error updating permissions:', error);
            alert('Failed to save permissions.');
        }
    };

    return (
        <Main>
            <div>
                <Breadcrumb>
                    <Link style={{ textDecoration: "none", color: "black" }} to="/Home"> Home <i class="fa fa-angle-right"></i></Link>
                    <Breadcrumb.Item active style={{ fontWeight: "bold" }}>&nbsp;Permissions</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <Card style={{boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15), 0 0 20px rgba(0, 0, 0, 0.1)'}}>
                <span style={{ fontSize: "16px", marginLeft: "10px", height: "40px", padding: "5px" }}>Permission List</span>
                {roles.map((role) => (
                    <Accordion key={role?.id}>
                        <Accordion.Item eventKey={role?.id}>
                            <Accordion.Header onClick={() => handleRoleSelect(role?.id)}>
                                {role.name}
                            </Accordion.Header>
                            <Accordion.Body>
                                {selectedRole === role?.id && (
                                    <Table striped bordered hover size="sm">
                                        <thead>
                                            <tr>
                                                <th className='bg-light border-0 text-black'>Module</th>
                                                <th className='bg-light border-0 text-black'>Add</th>
                                                <th className='bg-light border-0 text-black'>Edit</th>
                                                <th className='bg-light border-0 text-black'>View</th>
                                                <th className='bg-light border-0 text-black'>Delete</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {modules.map((mod) => {
                                                let permission = permissions.find(p => p.module_id === mod.id && p.role_id === role.id);
                                                console.log('permission', permission)
                                                return (
                                                    <tr key={mod.id}>
                                                        <td>{mod.name}</td>
                                                        <td>
                                                            <input
                                                                type="checkbox"
                                                                checked={permission?.add || false}
                                                                onChange={() => handlePermissionChange(mod.id, 'add')}
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="checkbox"
                                                                checked={permission?.edit || false}
                                                                onChange={() => handlePermissionChange(mod.id, 'edit')}
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="checkbox"
                                                                checked={permission?.view || false}
                                                                onChange={() => handlePermissionChange(mod.id, 'view')}
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="checkbox"
                                                                checked={permission?.del || false}
                                                                onChange={() => handlePermissionChange(mod.id, 'del')}
                                                            />
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </Table>
                                )}
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                ))}
                <Card.Footer className='mt-2'>
                    <div>
                        <button className='btn btn-primary float-end' onClick={handleSave}>Save</button>
                    </div>
                </Card.Footer>
            </Card>
        </Main>
    );
};

export default Permissions;
