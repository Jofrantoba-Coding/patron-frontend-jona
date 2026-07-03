package com.softcommerce.formularios;

import com.toedter.calendar.JDateChooser;
import com.toedter.calendar.JTextFieldDateEditor;
import com.softcommerce.general.controles.ComponentToolKit;
import java.util.logging.Logger;
import com.softcommerce.general.herramientas.DateTime;
import com.softcommerce.iconos.Gif;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.HeadlessException;
import java.awt.Toolkit;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.FocusEvent;
import java.awt.event.FocusListener;
import java.awt.event.ItemEvent;
import java.awt.event.ItemListener;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.awt.event.WindowEvent;
import java.awt.event.WindowListener;
import java.beans.PropertyChangeEvent;
import java.beans.PropertyChangeListener;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import javax.swing.JButton;
import javax.swing.JComponent;
import javax.swing.JDialog;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JSeparator;
import javax.swing.JTextField;
import javax.swing.KeyStroke;
import javax.swing.WindowConstants;
import javax.swing.border.EmptyBorder;
import javax.swing.border.LineBorder;

public class CambiarPeriodo extends JDialog implements WindowListener, KeyListener, ActionListener, ItemListener, FocusListener, MouseListener, PropertyChangeListener {

    private static final long serialVersionUID = 1L;
    private Main frmsys;
    private Gif gif;
    private JButton cbAceptar;
    private JButton cbCancelar;
    private JDateChooser dc_fechainicio;
    private JDateChooser dc_fechafin;
    private Date fechaInicio;
    private Date fechaFin;
    private String id_empresa;
    private java.net.URL path;

    public CambiarPeriodo(Main arg0, String id_empresa, java.net.URL path) throws HeadlessException {
        super(arg0);
        frmsys = arg0;
        this.id_empresa = id_empresa;
        this.path = path;
        inicialize();
    }

    private void inicialize() {
        addWindowListener(this);

        gif = new Gif();

        JPanel pnlSesion = new JPanel();
        pnlSesion.setLayout(new BorderLayout());
        pnlSesion.setBackground(Color.WHITE);

        JLabel lblTitle = new JLabel("Periodo");
        lblTitle.setOpaque(true);
        lblTitle.setFont(new Font(Font.SANS_SERIF, 1, 14));
        lblTitle.setForeground(new Color(255, 255, 255));
        lblTitle.setBackground(new Color(35, 117, 152));
        lblTitle.setPreferredSize(new Dimension(0, 25));
        lblTitle.setBorder(new EmptyBorder(0, 10, 0, 0));
        pnlSesion.add(lblTitle, BorderLayout.NORTH);

        JPanel pnl = new JPanel();
        pnl.setLayout(null);
        pnl.setBackground(new Color(238, 238, 238));

        JLabel lblImagenSeguridad = new JLabel();
        lblImagenSeguridad = new JLabel(gif.CALENDARBIG);
        lblImagenSeguridad.setBounds(15, 5, gif.CALENDARBIG.getIconWidth(), gif.CALENDARBIG.getIconHeight());
        pnl.add(lblImagenSeguridad);

        JLabel lblFechaInicio = new JLabel("Fecha Inicio");
        lblFechaInicio.setDisplayedMnemonic('c');
        lblFechaInicio.setBounds(130, 20, 60, 20);
        pnl.add(lblFechaInicio);

        dc_fechainicio = new JDateChooser("dd/MM/yyyy", "##/##/####", '_');
        ((JTextField) dc_fechainicio.getDateEditor()).addFocusListener(this);
        dc_fechainicio.setBounds(190, 20, 90, 20);
        dc_fechainicio.getJCalendar().addMouseListener(this);
        dc_fechainicio.getJCalendar().addFocusListener(this);
        dc_fechainicio.getJCalendar().addKeyListener(this);
        dc_fechainicio.getCalendarButton().addMouseListener(this);
        dc_fechainicio.getCalendarButton().addActionListener(this);
        dc_fechainicio.addPropertyChangeListener(this);
        dc_fechainicio.addMouseListener(this);
        dc_fechainicio.addKeyListener(this);
        dc_fechainicio.addFocusListener(this);
        ((JTextField) dc_fechainicio.getDateEditor()).registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                ((JTextFieldDateEditor) dc_fechafin.getDateEditor()).requestFocus();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false), JComponent.WHEN_FOCUSED);
        ((JTextField) dc_fechainicio.getDateEditor()).registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                dc_fechainicio.getCalendarButton().doClick();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_SPACE, 0, false), JComponent.WHEN_FOCUSED);
        pnl.add(dc_fechainicio);

        JLabel lblFechaFin = new JLabel("Fecha Fin");
        lblFechaFin.setBounds(130, 50, 60, 20);
        lblFechaFin.setDisplayedMnemonic('a');
        pnl.add(lblFechaFin);

        dc_fechafin = new JDateChooser("dd/MM/yyyy", "##/##/####", '_');
        ((JTextField) dc_fechafin.getDateEditor()).addFocusListener(this);
        dc_fechafin.setBounds(190, 50, 90, 20);
        dc_fechafin.getJCalendar().addMouseListener(this);
        dc_fechafin.getJCalendar().addFocusListener(this);
        dc_fechafin.getJCalendar().addKeyListener(this);
        dc_fechafin.getCalendarButton().addMouseListener(this);
        dc_fechafin.getCalendarButton().addActionListener(this);
        dc_fechafin.addPropertyChangeListener(this);
        dc_fechafin.addMouseListener(this);
        dc_fechafin.addKeyListener(this);
        dc_fechafin.addFocusListener(this);
        ((JTextField) dc_fechafin.getDateEditor()).registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                cbAceptar.doClick();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false), JComponent.WHEN_FOCUSED);
        ((JTextField) dc_fechafin.getDateEditor()).registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                dc_fechafin.getCalendarButton().doClick();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_SPACE, 0, false), JComponent.WHEN_FOCUSED);
        pnl.add(dc_fechafin);

        JSeparator jsep2 = new JSeparator();
        jsep2.setBounds(20, 100, 446, 5);
        pnl.add(jsep2);

        cbCancelar = new JButton("Cancelar");
        cbCancelar.addKeyListener(this);
        cbCancelar.addActionListener(this);
        cbCancelar.setBounds(310, 110, 90, 25);
        pnl.add(cbCancelar);

        cbAceptar = new JButton("Aceptar");
        cbAceptar.addKeyListener(this);
        cbAceptar.addActionListener(this);
        cbAceptar.setBounds(180, 110, 120, 25);
        pnl.add(cbAceptar);

        pnlSesion.add(pnl, BorderLayout.CENTER);

        setDefaultCloseOperation(WindowConstants.DISPOSE_ON_CLOSE);

        Dimension d = Toolkit.getDefaultToolkit().getScreenSize();
        int sr = Toolkit.getDefaultToolkit().getScreenResolution();

        setSize(new Dimension(435, 200));
        setResizable(false);
        setContentPane(pnlSesion);
        setModal(true);

        setTitle("Cambiar Periodo de Trabajo");
        ComponentToolKit.centerComponentPosicion(this);
    }

    public void setFechas(Date fechaInicio, Date fechaFin) {
        dc_fechainicio.setDate(fechaInicio);
        dc_fechafin.setDate(fechaFin);
    }

    @Override
    public void windowClosing(WindowEvent e) {
        dispose();
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (e.getSource() == dc_fechainicio.getCalendarButton()) {
            dc_fechainicio.setSelectableDateRange(DateTime.format(100, 0, 1), dc_fechafin.getDate());
        }

        if (e.getSource() == dc_fechafin.getCalendarButton()) {
            dc_fechafin.setSelectableDateRange(dc_fechainicio.getDate(), dc_fechafin.getMaxSelectableDate());
        }

        if (cbCancelar == e.getSource()) {
            dispose();
        }

        if (cbAceptar == e.getSource()) {
            if (isRegisterValid()) {
                fechaInicio = dc_fechainicio.getDate();
                fechaFin = dc_fechafin.getDate();
                java.sql.Date ini = new java.sql.Date(dc_fechainicio.getDate().getTime());
                Calendar calendarIni = new GregorianCalendar();
                calendarIni.setTime(ini);
                String annoInicio = String.valueOf(calendarIni.get(Calendar.YEAR));
                frmsys.setAnio(annoInicio);
                frmsys.setFechas(fechaInicio, fechaFin);
                dispose();
            }
        }
    }

    @Override
    public void keyPressed(KeyEvent e) {
        if (e.getKeyCode() == KeyEvent.VK_ESCAPE) {
            dispose();
        }
    }

    @Override
    public void focusGained(FocusEvent e) {
        if (e.getSource() == (JTextField) dc_fechainicio.getDateEditor()) {
            ((JTextField) dc_fechainicio.getDateEditor()).selectAll();
        }

        if (e.getSource() == (JTextField) dc_fechafin.getDateEditor()) {
            ((JTextField) dc_fechafin.getDateEditor()).selectAll();
        }
    }

    public boolean isRegisterValid() {
        try {
            ((JTextFieldDateEditor) dc_fechainicio.getDateEditor()).setBorder(((JTextFieldDateEditor) new JDateChooser().getDateEditor()).getBorder());
            ((JTextFieldDateEditor) dc_fechafin.getDateEditor()).setBorder(((JTextFieldDateEditor) new JDateChooser().getDateEditor()).getBorder());

            if (((JTextFieldDateEditor) dc_fechainicio.getDateEditor()).getText().equals("__/__/____")
                    || !DateTime.isValidDate(((JTextFieldDateEditor) dc_fechainicio.getDateEditor()).getText().replace("_", "0"))) {
                JOptionPane.showMessageDialog(this, "La fecha de Inicio que has especificado no es válida. Compruébala e inténtalo de nuevo.", "Cambiar Fecha", JOptionPane.INFORMATION_MESSAGE);
                ((JTextFieldDateEditor) dc_fechainicio.getDateEditor()).setBorder(new LineBorder(Color.RED));
                ((JTextFieldDateEditor) dc_fechainicio.getDateEditor()).requestFocus();

                return false;
            }

            if (((JTextFieldDateEditor) dc_fechafin.getDateEditor()).getText().equals("__/__/____")
                    || !DateTime.isValidDate(((JTextFieldDateEditor) dc_fechafin.getDateEditor()).getText().replace("_", "0"))) {
                JOptionPane.showMessageDialog(this, "La fecha de Fin que has especificado no es válida. Compruébala e inténtalo de nuevo.", "Cambiar Fecha", JOptionPane.INFORMATION_MESSAGE);
                ((JTextFieldDateEditor) dc_fechafin.getDateEditor()).setBorder(new LineBorder(Color.RED));
                ((JTextFieldDateEditor) dc_fechafin.getDateEditor()).requestFocus();

                return false;
            }

            if (DateTime.diferenciasDeFechas(Funciones.getParametro("INICIO_ACTIVIDADES", id_empresa, path), ((JTextFieldDateEditor) dc_fechainicio.getDateEditor()).getText()) < 0) {
                JOptionPane.showMessageDialog(this, "La fecha de inicio de actividades es mayor a la fecha de inicio que has especificado. Compruébala e inténtalo de nuevo.", "Cambiar Fecha", JOptionPane.INFORMATION_MESSAGE);
                ((JTextFieldDateEditor) dc_fechainicio.getDateEditor()).setBorder(new LineBorder(Color.RED));
                ((JTextFieldDateEditor) dc_fechainicio.getDateEditor()).requestFocus();

                return false;
            }

            if (DateTime.diferenciasDeFechas(((JTextFieldDateEditor) dc_fechainicio.getDateEditor()).getText(), ((JTextFieldDateEditor) dc_fechafin.getDateEditor()).getText()) < 0) {
                JOptionPane.showMessageDialog(this, "La fecha de fin es menor a la Fecha de inicio que has especificado. Compruébala e inténtalo de nuevo.", "Cambiar Fecha", JOptionPane.INFORMATION_MESSAGE);
                ((JTextFieldDateEditor) dc_fechafin.getDateEditor()).setBorder(new LineBorder(Color.RED));
                ((JTextFieldDateEditor) dc_fechafin.getDateEditor()).requestFocus();

                return false;
            }

            /*Jonathan*/
            java.sql.Date ini = new java.sql.Date(dc_fechainicio.getDate().getTime());
            java.sql.Date fin = new java.sql.Date(dc_fechafin.getDate().getTime());
            Calendar calendarIni = new GregorianCalendar();
            Calendar calendarFin = new GregorianCalendar();
            calendarIni.setTime(ini);
            calendarFin.setTime(fin);
            String annoInicio = String.valueOf(calendarIni.get(Calendar.YEAR));
            String annoFin = String.valueOf(calendarFin.get(Calendar.YEAR));
            if (!annoInicio.equalsIgnoreCase(annoFin)) {
                JOptionPane.showMessageDialog(this, "Las fechas Inicio y Fin deben estar en el mismo año contable.", "Año Contable", JOptionPane.INFORMATION_MESSAGE);
                return false;
            }

            return true;
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
            return false;
        }
    }

    @Override
    public void propertyChange(PropertyChangeEvent evt) {
    }

    @Override
    public void windowOpened(WindowEvent e) {
    }

    @Override
    public void windowClosed(WindowEvent e) {
    }

    @Override
    public void windowIconified(WindowEvent e) {
    }

    @Override
    public void windowDeiconified(WindowEvent e) {
    }

    @Override
    public void windowActivated(WindowEvent e) {
    }

    @Override
    public void windowDeactivated(WindowEvent e) {
    }

    @Override
    public void keyTyped(KeyEvent e) {
    }

    @Override
    public void keyReleased(KeyEvent e) {
    }

    @Override
    public void itemStateChanged(ItemEvent e) {
    }

    @Override
    public void focusLost(FocusEvent e) {
    }

    @Override
    public void mouseClicked(MouseEvent e) {
    }

    @Override
    public void mousePressed(MouseEvent e) {
    }

    @Override
    public void mouseReleased(MouseEvent e) {
    }

    @Override
    public void mouseEntered(MouseEvent e) {
    }

    @Override
    public void mouseExited(MouseEvent e) {
    }
    private static final Logger LOG = Logger.getLogger(CambiarPeriodo.class.getName());
}
